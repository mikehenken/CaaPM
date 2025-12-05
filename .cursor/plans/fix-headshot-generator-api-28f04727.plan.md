<!-- 28f04727-da0e-4981-9743-1dd3ab607db5 8ed83509-613a-4541-b942-5777d50bdc95 -->
# Fix Headshot Generator API & Stability

## Root Cause Analysis

The "silent errors" and issues are caused by two specific problems, not `uvicorn` (which is the correct, industry-standard server for FastAPI):

1.  **Fatal Import Error:** `headshot_routes.py` attempts to import `generate_headshot_image` from `headshot_service.py`, but this function **does not exist**. This causes the application to crash silently at startup or fail to load the module, leading to 404s or connection refused errors.
2.  **Route Collision:** Both `ai_routes.py` and `headshot_routes.py` are registering endpoints that resolve to `/ai/headshot/generate`. This causes "Route Shadowing" where one endpoint hides the other, leading to unpredictable behavior (404s, 307 redirects, or calling the wrong handler).

## Plan

1.  **Fix Fatal Import in `headshot_routes.py`:**

    -   File: [`backend/app/routers/headshot_routes.py`](backend/app/routers/headshot_routes.py)
    -   Action: Remove the invalid import `from app.services.headshot_service import generate_headshot_image`.
    -   Action: Import the correct service accessor `from app.services.headshot_service import get_headshot_service`.
    -   Action: Rewrite `generate_headshot_route` to instantiate the service class and call `await service.generate_headshot(...)`.

2.  **Resolve Route Collision:**

    -   File: [`backend/app/routers/ai_routes.py`](backend/app/routers/ai_routes.py)
    -   Action: Remove the conflicting `@router.post("/headshot/generate")` endpoint entirely. It is legacy code and is now superceded by the dedicated router.

3.  **Update Frontend Service (Verification):**

    -   File: [`frontend/src/services/ai/headshot-ai.service.ts`](frontend/src/services/ai/headshot-ai.service.ts)
    -   Action: Ensure it points to the correct endpoint `/ai/headshot/generate` (which matches the new `headshot_routes` mounted at `/ai/headshot`).

4.  **Verify Fixes:**

    -   Restart the backend server.
    -   Check logs to ensure no startup errors.
    -   Run the E2E test `frontend/tests/e2e/headshot-real.spec.ts` to confirm the full flow works.