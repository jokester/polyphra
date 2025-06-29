import uuid
from pydantic import BaseModel
from itsdangerous import URLSafeSerializer

class Session(BaseModel):
    user_id: str | int | None = None
    session_id: uuid.UUID

class SessionService:
    def __init__(self, secret_key: str, salt: str = "polyphra_session"):
        # self.__secret_key = secret_key
        # if not salt:
            # salt = crypt.mksalt(method=crypt.METHOD_SHA256)
        self.__serializer = URLSafeSerializer(secret_key=secret_key, salt=salt)


    def create_session(
        self, user_id: str | int | None = None, salt: str | None = None
    ) -> str:
        """
        Creates a session token for the given user ID.
        A session token is opaque to user.
        """
        session_data = Session(user_id=user_id, session_id=uuid.uuid4())
        return self.__serializer.dumps(session_data.model_dump_json())

    def inflate_session(self, authorization: str) -> Session:
        """
        Extracts the session information from the authorization header.
        """
        if not authorization:
            raise ValueError("Authorization header is required")

        if not authorization.startswith("Bearer "):
            raise ValueError("Invalid authorization token")

        bearer_token = authorization[len("Bearer ") :].strip()
        return Session.model_validate_json(self.__serializer.loads(bearer_token))
