from flask_openapi3 import Info, OpenAPI
from app.config.settings import SETTING
from app.api.health_check.routes import health_check_route  # noqa
from app.api.movies.routes import movies_route

info = Info(title="Flask API", version="1.0.0")

app = OpenAPI(__name__, info=info,  doc_prefix="/docs", doc_ui=SETTING.DEBUG)
# from app.api.auth.routes import auth_route  # noqa

app.register_api(health_check_route)
app.register_api(movies_route)
