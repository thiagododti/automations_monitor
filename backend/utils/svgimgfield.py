import imghdr
from rest_framework import serializers
from defusedxml import ElementTree as ET
from django.core.files.images import get_image_dimensions


class SVGAndImageField(serializers.FileField):
    ALLOWED_IMAGE_TYPES = {"jpeg", "png", "gif", "bmp", "webp"}
    MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

    def to_internal_value(self, data):
        file = super().to_internal_value(data)

        # valida tamanho
        if file.size > self.MAX_FILE_SIZE:
            raise serializers.ValidationError("Arquivo muito grande (máx 5MB)")

        file.seek(0)
        header = file.read(512)
        file.seek(0)

        # detecta se é SVG por conteúdo (não só extensão)
        is_svg = b"<svg" in header.lower()

        if is_svg:
            return self._validate_svg(file)

        return self._validate_image(file)

    def _validate_svg(self, file):
        try:
            tree = ET.parse(file)
            root = tree.getroot()
        except Exception:
            raise serializers.ValidationError("SVG inválido ou corrompido")

        # sanitização básica
        for elem in root.iter():
            tag = elem.tag.lower()

            # bloqueia scripts
            if "script" in tag:
                raise serializers.ValidationError(
                    "SVG contém script malicioso")

            # remove atributos perigosos
            attrs_to_remove = []
            for attr in elem.attrib:
                attr_lower = attr.lower()
                value = elem.attrib[attr].lower()

                if attr_lower.startswith("on"):  # onclick, onload...
                    attrs_to_remove.append(attr)

                if "javascript:" in value:
                    attrs_to_remove.append(attr)

            for attr in attrs_to_remove:
                del elem.attrib[attr]

        file.seek(0)
        return file

    def _validate_image(self, file):
        file.seek(0)
        file_type = imghdr.what(file)

        if file_type not in self.ALLOWED_IMAGE_TYPES:
            raise serializers.ValidationError(
                "Formato de imagem não suportado")

        try:
            get_image_dimensions(file)
        except Exception:
            raise serializers.ValidationError("Imagem inválida ou corrompida")

        file.seek(0)
        return file
