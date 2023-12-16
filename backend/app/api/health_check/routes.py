from flask_openapi3 import APIBlueprint, Tag
from bson.json_util import dumps

tag = Tag(name="health_check", description="Health Check Operations")

health_check_route = APIBlueprint("health", __name__, abp_tags=[tag], url_prefix="/")

@health_check_route.get("/health")
def health_jobs():
    return dumps({"Status":"Good!"}), 200