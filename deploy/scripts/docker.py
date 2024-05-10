import os
from scripts.cli_read import CliRead
from scripts.log import Log


class Docker:
    def __init__(self, cli_read: CliRead = CliRead(), log_level=1):
        self.cli_read = cli_read
        self.log = Log(log_level=log_level)

    def build_and_push(
        self, ecr_uri: str, image: str, tag: str, region: str, profile: str = None
    ) -> None:
        profile = f"--profile {profile}" if profile and profile != "default" else ""
        full_image = f"{ecr_uri}/{image}:{tag}"
        self.log.info(f"🐋 Building image {full_image}")
        self.cli_read.cmd(f"docker build -t {full_image} . --quiet")
        self.cli_read.cmd(
            f"aws {profile} --region {region} ecr get-login-password | docker login --username AWS --password-stdin {ecr_uri} > /dev/null"
        )
        self.log.info(f"🐋 Building image {full_image}")
        output = self.cli_read.cmd(f"docker push {full_image} --quiet")
        self.log.info(output)

    def ecr_uri(self, account_id: str, region: str) -> str:
        return f"{account_id}.dkr.ecr.{region}.amazonaws.com"
