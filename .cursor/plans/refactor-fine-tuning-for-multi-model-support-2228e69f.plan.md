<!-- 2228e69f-7f3e-4a56-82a4-45b617481927 1be3555b-dc63-48bf-b7e0-afdeb18bf63e -->
# Deep Research & Multi-Model Architecture Roadmap

## Technology Stack

-   **Base Models:** **Gemini 3 Pro** (Text/Multimodal), **Gemini 3 Pro Image Preview** (Image Generation)
-   **Embeddings:** `text-embedding-004` (Model Garden)
-   **Search / RAG:** Vertex AI Search (Grounding with Google Search), Vertex AI Search (Unstructured Data)
-   **Vector Database:** Vertex AI Vector Search (Scalable Nearest Neighbor with Filtering)
-   **Orchestration:** Cloud Run (Application), Vertex AI Training (Fine-tuning jobs), **Vertex AI Batch Prediction**
-   **Model Management:** Vertex AI Model Registry, Vertex AI Endpoints
-   **Storage:** Google Cloud Storage (GCS) for Knowledge Base and Training Data
-   **Infra Provisioning:** Google Cloud Python SDK (for AI resources)

## Phase 0: Strategy & Documentation (The "AI Bible")

*Goal: Create the definitive source of truth for the entire AI Suite's personas, capabilities, data strategy, and future roadmap.*

1.  **Whitepaper Creation:** Write `ai-tooling/docs/AI_ARCHITECTURE_WHITEPAPER.md`.

    -   **The "Knowledge Flywheel":** Document the cycle of Research -> Distillation -> Training across all models.
    -   **Tool Execution Architecture:** Detailed flow of how models output JSON -> Backend executes Python function -> Result fed back to model context.
    -   **Agent Suite Specs:**
        -   **Career Coach (Text):** Witty, Proactive, EQ-driven.
        -   **Expert Photographer (Image):** Visual critic, Style transfer, "Good vs Bad" benchmarks.
        -   **Mock Interviewer (Audio/Text):** Real-time feedback, Tone analysis, Question adaptability.
    -   **Feature Deep Dives:** Resume Comparison (Vector), Job Matching (Reverse Vector), Headshot Advisor (Multi-modal), Company Research (Deep Search).
    -   **Data Strategy:** Explicit mapping of "Global vs. Expert vs. User" data isolation and storage.

## Phase 1: Architecture & Tooling Foundation

*Goal: Establish the `ai-tooling` directory and flexible configuration system to support multiple models.*

1.  **Restructure Directory:** Move `backend/scripts/fine_tuning/` to `ai-tooling/` with a modular structure (`models/`, `tools/`, `infra/`, `notebooks/`, `docs/`).
2.  **Model Scaffolding:** Create directories for all agents:

    -   `models/career_coach/`
    -   `models/expert_photographer/`
    -   `models/mock_interviewer/`

3.  **Configuration System:** Implement `config.yaml` for each model to define their specific Tools and Training Params.
4.  **Refactor Generator:** Update `generate_training_data.py` to be model-agnostic and read from the new config system.
5.  **Prompt Extraction:** Centralize personas and system instructions into `prompts.py` for each model.

## Phase 2: Search Infrastructure (The "Brain")

*Goal: Build the three pillars of intelligence: Real-time, Expert, and Semantic.*

1.  **Public Web Store (Grounding):** Create `setup_web_store.py` (Python SDK) to configure Vertex AI Search for "Grounding with Google Search." Powers real-time queries.
2.  **Expert Knowledge Store (SME):**

    -   **Setup:** Create `setup_expert_store.py` (Python SDK) to configure a Vertex AI Search App for **Unstructured Data** (ATS Guides, Soft Skills Frameworks).
    -   **Ingestion:** Create `ingest_knowledge.py` to upload local docs -> GCS Bucket -> Trigger Indexing.

3.  **Vector Search Index (Comparison & Memory):**

    -   **Setup:** Create `setup_vector_index.py` (Python SDK) to deploy a **Vertex AI Vector Search Index**.
    -   **Data Strategy (Hybrid):**
        -   **Global:** 10k Public Resumes/Jobs (for "Comparison" and "Reverse Matching").
        -   **User:** User Profiles/Memories (tagged by `user_id` for "Personalization").
    -   **Ingestion:** Create `embed_documents.py` to batch-convert text -> embeddings (using `text-embedding-004`) -> Upload to Index.

## Phase 3: Fine-Tuning the Agents

*Goal: Train the models to use tools effectively and master their specific domains.*

1.  **Data Generation (Distillation):** Run the refactored generator to create training examples for all agents.

    -   *Career Coach:* Soft Skills, Negotiation, ATS logic.
    -   *Photographer:* Image critique logic (multimodal inputs).
    -   *Interviewer:* Behavioral questions, feedback loops.

2.  **Training Pipeline:** Create `deploy.py` scripts for each model to:

    -   Submit Fine-Tuning Job.
    -   **Register Model:** Save the fine-tuned adapter to **Vertex AI Model Registry**.
    -   **Deploy Endpoint:** Deploy the registered model to a **Vertex AI Endpoint** for real-time serving.

## Phase 4: Application Integration (Backend/Frontend)

*Goal: Connect the smart models to the actual user experience.*

1.  **Backend Integration:** Update `backend/app/services/chat_service.py` to route requests to the correct **Fine-Tuned Model Endpoint** (Coach vs. Photographer vs. Interviewer).
2.  **Runtime Services:**

    -   `vertex_search_service.py`: Handles Web & Expert search.
    -   `vector_service.py`: Handles embedding generation and nearest-neighbor queries (using `user_id` filtering).
    -   `batch_service.py`: Handles submitting **Vertex AI Batch Prediction** jobs.

3.  **Tool Execution Logic:** Implement the runtime logic in FastAPI to execute tool calls returned by the models.
4.  **Frontend "Deep Research" UI:** Display citations and "Resume Score" visualizations based on vector similarity.

### To-dos

- [x] [Phase 0] Create `ai-tooling/docs` directory and write `AI_ARCHITECTURE_WHITEPAPER.md` covering all 3 agents, tool execution, and knowledge flywheel
- [x] [Phase 1] Create directory structure `ai-tooling/models/career_coach`, `ai-tooling/tools`, `ai-tooling/infra/search`, `ai-tooling/infra/vector`, and `ai-tooling/notebooks`
- [x] [Phase 1] Create `config.yaml` for Career Coach including Triple-Search tool definitions
- [x] [Phase 1] Extract Career Coach prompts into `ai-tooling/models/career_coach/prompts.py`
- [x] [Phase 1] Refactor `generate_training_data.py` to `ai-tooling/tools/` and read from config
- [x] [Phase 2] Create `ai-tooling/infra/search/setup_web_store.py` and `setup_expert_store.py`
- [x] [Phase 2] Create `ai-tooling/infra/vector/setup_vector_index.py` and `embed_documents.py` (handling Resumes, Jobs, Q&A)
- [x] [Phase 2] Create `ai-tooling/tools/submit_batch_job.py` for high-volume inference/generation
- [x] [Phase 3] Create `ai-tooling/models/career_coach/deploy.py` for Vertex AI training, registration, and endpoint deployment
- [x] [Phase 4] Create placeholder `backend/app/services/vector_service.py` and `batch_service.py` for runtime execution
- [x] [Phase 4] Create `backend/app/services/job_matcher_service.py` for proactive job notifications