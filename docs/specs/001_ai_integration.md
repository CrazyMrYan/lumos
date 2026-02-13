# Lumos AI Integration - Phase 1 Specification

**Version**: 1.0
**Status**: Draft
**Feature Branch**: `feature/ai-integration-v1`

## 1. Overview
Introduce "AI Generation" capabilities to Lumos, shifting the workflow from "Manual Writing" to "AI Generating -> Human Refining".

## 2. User Stories
- **US-001**: As a user, I want to click a "✨ Generate" button in the toolbar.
- **US-002**: As a user, I want to input a topic (e.g., "History of Bitcoin") and select a format (Slides/MindMap).
- **US-003**: As a user, I want the editor to automatically populate with AI-generated, structured Markdown content.
- **US-004**: As a user, I want the Preview to automatically open after generation.

## 3. Technical Specs

### 3.1 Backend (API Route)
- **Endpoint**: `POST /api/generate`
- **Payload**:
  ```json
  {
    "topic": "string",
    "mode": "slides" | "mindmap"
  }
  ```
- **Response**:
  ```json
  {
    "markdown": "string"
  }
  ```
- **Mocking**: For Phase 1 MVP, we will use a **Mock Generator** to simulate AI latency and response structure, to validate the UI flow without burning API credits immediately.

### 3.2 Frontend (UI)
- **Component**: `AIGeneratorModal.tsx`
  - Floating dialog with input field.
  - "Generating..." loading state with spinner.
- **Integration**:
  - Add "✨" button to `page.tsx` header.
  - On success: Update `content` state, Auto-open `showPreview`.

## 4. Mock Data Templates
### Slides Template
```markdown
# [Topic]
## A brief overview

---

## Key Point 1
- Detail A
- Detail B

---

## Key Point 2
![Image](https://source.unsplash.com/random/800x600?tech)
```

### MindMap Template
```markdown
# [Topic]
## Branch 1
- Leaf 1
- Leaf 2
## Branch 2
- Leaf 3
```

## 5. Development Plan
1. Create `docs/specs/001_ai_integration.md` (This file).
2. Create `src/components/AIGeneratorModal.tsx`.
3. Create `src/app/api/generate/route.ts` (Mock).
4. Integrate into `src/app/page.tsx`.
5. Test flow -> Commit -> Push.
