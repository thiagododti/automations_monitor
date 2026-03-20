from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from drf_spectacular.utils import extend_schema, OpenApiParameter
from django.db.models import Sum, Count, Avg, Q
from django.db.models.functions import TruncDay, TruncWeek, TruncMonth

from apps.executions.models import Execution
from apps.executions.constants import ExecutionStatus
from apps.executions.api.filters import DashboardFilter
from apps.executions.api.serializers import KPISerializer, KPIByAutomationSerializer, EvolutionSerializer


class BaseDashboardView(APIView):
    # authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_filtered_queryset(self, request):
        qs = Execution.objects.exclude(status=ExecutionStatus.TESTE)
        f = DashboardFilter(request.query_params, queryset=qs)
        return f.qs


@extend_schema(
    tags=["Dashboard"],
    description="KPIs gerais consolidados. Sem filtro de business retorna visão admin (todas as empresas).",
    parameters=[
        OpenApiParameter(name="business", type=int, required=False),
        OpenApiParameter(name="automation", type=int, required=False),
        OpenApiParameter(name="status", type=str, required=False),
        OpenApiParameter(name="date_from", type=str, required=False),
        OpenApiParameter(name="date_to", type=str, required=False),
    ]
)
class KPIView(BaseDashboardView):
    def get(self, request):
        qs = self.get_filtered_queryset(request)

        totals = qs.aggregate(
            total_executions=Count('id'),
            total_time_economy_seconds=Sum('time_economy_seconds'),
            total_cost_economy=Sum('cost_economy'),
            total_potential_cost=Sum('potential_cost'),
            total_potential_time_seconds=Sum('potential_time_seconds'),
            avg_efficiency_percent=Avg('efficiency_percent'),
            total_errors=Sum('error_count'),
            total_success=Sum('success_count'),
        )

        # Garante que nenhum campo venha None
        data = {
            'total_executions': totals['total_executions'] or 0,
            'total_time_economy_seconds': totals['total_time_economy_seconds'] or 0,
            'total_cost_economy': totals['total_cost_economy'] or 0,
            'total_potential_cost': totals['total_potential_cost'] or 0,
            'total_potential_time_seconds': totals['total_potential_time_seconds'] or 0,
            'avg_efficiency_percent': totals['avg_efficiency_percent'] or 0,
            'total_errors': totals['total_errors'] or 0,
            'total_success': totals['total_success'] or 0,
        }

        serializer = KPISerializer(data)
        return Response(serializer.data)


@extend_schema(
    tags=["Dashboard"],
    description="KPIs agrupados por automação.",
    parameters=[
        OpenApiParameter(name="business", type=int, required=False),
        OpenApiParameter(name="status", type=str, required=False),
        OpenApiParameter(name="date_from", type=str, required=False),
        OpenApiParameter(name="date_to", type=str, required=False),
    ]
)
class KPIByAutomationView(BaseDashboardView):
    def get(self, request):
        qs = self.get_filtered_queryset(request)

        data = (
            qs
            .values('automation__id', 'automation__name')
            .annotate(
                total_executions=Count('id'),
                avg_efficiency_percent=Avg('efficiency_percent'),
                total_cost_economy=Sum('cost_economy'),
                total_potential_cost=Sum('potential_cost'),
                total_time_economy_seconds=Sum('time_economy_seconds'),
                total_errors=Sum('error_count'),
            )
            .order_by('-total_executions')
        )

        result = [
            {
                'automation_id': row['automation__id'],
                'automation_name': row['automation__name'],
                'total_executions': row['total_executions'] or 0,
                'avg_efficiency_percent': row['avg_efficiency_percent'] or 0,
                'total_cost_economy': row['total_cost_economy'] or 0,
                'total_potential_cost': row['total_potential_cost'] or 0,
                'total_time_economy_seconds': row['total_time_economy_seconds'] or 0,
                'total_errors': row['total_errors'] or 0,
            }
            for row in data
        ]

        serializer = KPIByAutomationSerializer(result, many=True)
        return Response(serializer.data)


@extend_schema(
    tags=["Dashboard"],
    description="Evolução temporal das execuções. group_by aceita: day, week, month (default: month).",
    parameters=[
        OpenApiParameter(name="business", type=int, required=False),
        OpenApiParameter(name="automation", type=int, required=False),
        OpenApiParameter(name="status", type=str, required=False),
        OpenApiParameter(name="date_from", type=str, required=False),
        OpenApiParameter(name="date_to", type=str, required=False),
        OpenApiParameter(name="group_by", type=str, required=False, enum=["day", "week", "month"]),
    ]
)
class EvolutionView(BaseDashboardView):
    TRUNC_MAP = {
        'day': TruncDay,
        'week': TruncWeek,
        'month': TruncMonth,
    }

    def get(self, request):
        qs = self.get_filtered_queryset(request)

        group_by = request.query_params.get('group_by', 'month')
        trunc_fn = self.TRUNC_MAP.get(group_by, TruncMonth)

        data = (
            qs
            .annotate(period=trunc_fn('date_start'))
            .values('period')
            .annotate(
                total_executions=Count('id'),
                total_time_economy_seconds=Sum('time_economy_seconds'),
                total_cost_economy=Sum('cost_economy'),
                avg_efficiency_percent=Avg('efficiency_percent'),
            )
            .order_by('period')
        )

        result = [
            {
                'period': row['period'].strftime('%Y-%m-%d') if row['period'] else None,
                'total_executions': row['total_executions'] or 0,
                'total_time_economy_seconds': row['total_time_economy_seconds'] or 0,
                'total_cost_economy': row['total_cost_economy'] or 0,
                'avg_efficiency_percent': row['avg_efficiency_percent'] or 0,
            }
            for row in data
        ]

        serializer = EvolutionSerializer(result, many=True)
        return Response(serializer.data)