import urllib.parse

import boto3
from botocore.exceptions import ClientError

from app.core.config import get_settings


class S3Service:
    """Lightweight wrapper around boto3 for common S3 operations."""

    def __init__(self):
        settings = get_settings()
        self.bucket = settings.s3_bucket_name
        if not self.bucket:
            raise RuntimeError("S3_BUCKET_NAME setting is not configured")

        self.region = settings.aws_region
        self.s3 = boto3.client(
            "s3",
            region_name=self.region,
            aws_access_key_id=settings.aws_access_key_id,
            aws_secret_access_key=settings.aws_secret_access_key,
        )

    # Upload
    def upload_fileobj(self, file_obj, key: str) -> str:
        """Upload a file-like object to S3 and return its public URL."""
        self.s3.upload_fileobj(file_obj, self.bucket, key)
        return self.generate_file_url(key)

    # Delete
    def delete_file(self, key: str):
        try:
            self.s3.delete_object(Bucket=self.bucket, Key=key)
        except ClientError as e:
            raise e

    # Download / fetch
    def get_file_body(self, key: str):
        response = self.s3.get_object(Bucket=self.bucket, Key=key)
        return response["Body"]

    # Helpers
    def generate_file_url(self, key: str) -> str:
        if self.region:
            return f"https://{self.bucket}.s3.{self.region}.amazonaws.com/{key}"
        return f"https://{self.bucket}.s3.amazonaws.com/{key}"

    @staticmethod
    def extract_key_from_url(url: str) -> str:
        parsed = urllib.parse.urlparse(url)
        return parsed.path.lstrip("/")


s3_service = S3Service()
