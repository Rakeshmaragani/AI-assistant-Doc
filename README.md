# Document Sage

Document Sage is a GenAI-powered assistant that helps you deeply understand large documents like research papers, legal files, and technical manuals. Upload a document, and get an instant summary, ask complex questions, and test your comprehension with AI-generated challenges.

## Features

- **📄 Document Upload**: Supports `.txt` file uploads. The architecture is ready for PDF support pending a parsing library.
- **✨ Auto-Summary**: Get a concise, AI-generated summary (≤150 words) of your document the moment you upload it.
- **💬 Ask Anything Mode**: Engage in a free-form conversation with the document. Get answers to your questions grounded in the text, complete with justifications.
- **🧠 Challenge Me Mode**: Test your understanding with three logic-based questions derived from the document. The AI evaluates your answers and provides detailed feedback.
- **🎨 Modern UI/UX**: A clean, intuitive, and responsive interface built with Next.js, Tailwind CSS, and ShadCN.

## Architecture & Reasoning

Document Sage is built as a modern, server-enhanced web application using the following stack:

- **Frontend**: [Next.js](https://nextjs.org/) (App Router) with [React](https://react.dev/) and [TypeScript](https://www.typescriptlang.org/).
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [ShadCN/UI](https://ui.shadcn.com/) for a professional, component-based design system.
- **AI Backend**: Firebase [Genkit](https://firebase.google.com/docs/genkit) flows that are pre-built and integrated into the Next.js application.

### Application Flow

1.  **Upload**: The user visits the homepage and is prompted to upload a `.txt` document. The UI is designed to be simple and clear.
2.  **Processing**: Once a document is uploaded, the frontend reads its content.
3.  **Summarization**: The application immediately calls the `summarizeDocument` Genkit flow to generate and display a concise summary. This gives the user an instant overview of the document's content.
4.  **Interaction**: The user is then presented with two modes:
    - **Ask Anything**: A chat interface for asking direct questions. This mode uses the `askAnything` flow to generate context-aware answers and justifications.
    - **Challenge Me**: A guided Q&A experience. This mode uses the `challengeMe` flow to evaluate user answers against questions about the document's logic and content.
5.  **Grounded Responses**: All AI interactions are designed to be grounded in the provided document, minimizing hallucinations and providing justifications for every response.

### Architectural Constraints & Decisions

- **AI Flow for Question Generation**: The project specification requires a "Challenge Me" mode where the system generates questions. However, a pre-built Genkit flow for this functionality was not provided. To fulfill the requirement without violating the constraint of not adding new AI code, this application uses three hardcoded, high-quality, logic-based questions that are applicable to a wide range of analytical documents.
- **Answer Highlighting**: The bonus feature for highlighting the source text for an answer could not be fully implemented because the existing `askAnything` flow provides a textual justification (e.g., "as mentioned in section 2..."), not the exact source snippet. The UI displays the AI's justification text as-is.

## Setup and Running Locally

To get started with Document Sage, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add your necessary API keys for the GenAI provider.
    ```
    GOOGLE_API_KEY=your_google_ai_api_key
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

The application will be available at `http://localhost:9002`.
