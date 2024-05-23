from stacks.template_path import path
from scripts.stacks import Stack, stack_name


def my_stack_name(stage: str, tenant: str) -> str:
    return stack_name(stage=stage, tenant=tenant, name="Orders-Email")


def stack(
    stage: str,
    tenant: str,
    microservice: str,
    log_level: str,
) -> Stack:
    return Stack(
        template=path("stacks", "emails.yaml"),
        stack_name=my_stack_name(stage, tenant),
        parameters={
            "Stage": stage,
            "Tenant": tenant,
            "Microservice": microservice,
            "LogLevel": log_level,
        },
    )
