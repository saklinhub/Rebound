# Rebound: AI Revenue Recovery Agent
**Razorpay Buildathon — Track 3 Submission**


## The Bar: Detect, Diagnose, Recover.
This project explicitly fulfills the mandate of the Razorpay Buildathon: **Build an agent that detects revenue at risk, determines the right intervention, and executes a bounded recovery workflow.** 

Rebound is an entirely headless, event-driven AI microservice that intercepts Razorpay `payment.failed` webhooks and recovers the money autonomously. It doesn't just identify the problem—it visually tracks **₹ recovered across batches**, enforces compliant strict stopping rules (circuit breakers), and maintains an immutable PostgreSQL Audit Trail of the AI’s logical reasoning.

### Why Now?
Revenue loss rarely happens in one clean step. A payment degrades, a checkout gets abandoned, a subscription fails, or an invoice goes overdue. Traditional rules-engines and predictive ML models can only flag these failures in binary. 

**Generative AI (Gemini 2.5 Pro)** can now close the loop globally: reading the context of the drop, diagnosing the *human* reason for the failure, choosing the mathematically superior intervention (e.g., ROUTE_TO_UPI vs SEND_DISCOUNT), and dynamically writing a hyper-personalized recovery communication ("Hinglish" for retail, strictly formal for B2B) to win the money back.

---

## 🛠️ Quick Start (Zero-Friction Deployment)

I have containerized the entire stack. You do not need to configure any local databases or SDKs.

### Option A: The "One-Command" Docker Deploy (Recommended)
You only need Docker Desktop installed.

```bash
# 1. Clone the repository
git clone <your-repo-link>
cd Rebound

# 2. Setup environment variables (Safe Defaults Included)
cp .env.example .env

# 3. Build and launch the cluster
docker-compose up -d --build
```
* **Frontend Dashboard:** [http://localhost:3000](http://localhost:3000)
* **API Swagger Documentation:** [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)

**To run the AI:** When you open the frontend on port 3000, simply paste your Free Gemini API Key ([aistudio.google.com](https://aistudio.google.com/apikey)) into the Setup Screen. Hit **"Run Recovery Agent"** to watch the AI orchestrate 200 failed transactions in real-time!

### Option B: Local Source Build
Requires Node.js 20, Java 17, and PostgreSQL 16.
1. Create a database in Postgres called `rebound`.
2. Copy `.env.example` to `.env` and fill in your DB credentials.
3. Start Backend: `cd backend && ./mvnw spring-boot:run`
4. Start Frontend: `cd frontend && npm install && npm run dev`

---

## 🧠 The Four Bounded Recovery Workflows

Rebound securely delegates decisions to the AI, bounded by strict business-logic circuit breakers (e.g. `maximum retries = 3` and `fraud flag = false`).

| Workflow | Target | Bounded Interventions | Success Strategy |
|---|---|---|---|
| **Payment Degradation** | Failed live transactions | Route to UPI, Request New Card | Optimize retry path based on technical failure reason. |
| **Checkout Recovery** | Abandoned carts | Cart Link, LTV-based Offers | Engage dynamically (Hinglish text) to prevent churn up to 2 times. |
| **Subscription Recovery** | Lapsed recurring payments | Soft Retry, Route to Alternate | Graceful downgrades rather than harsh cancellations. |
| **Receivables Chaser** | Overdue B2B invoices | Friendly Reminder, Formal Notice | Fast-track human escalation for invoices over ₹50k or >30 days late. |

---

## 🏆 Why This Clears The Bar (Judging Criteria)

*   **Measured Money Recovered:** The React Dashboard proves ROI, instantly tracking `₹ Recovered` grouped by batch timing and workflow.
*   **Compliant Escalation & Stopping Rules:** Bounded Optimization. If a transaction trips our `riskFlag` (suspected fraud), the Java Orchestration engine physically short-circuits the AI. The AI *cannot* act on it, routing it safely to `ESCALATED`.
*   **A Ruthless Audit Trail:** We don't just "use AI". Every single micro-decision Gemini makes is strictly formatted via a JSON-Schema constraint. The exact API request, the AI’s root-cause logic, and the latency processing time (ms) are permanently logged into the PostgreSQL Database via automated Flyway migrations.
*   **Real-time Headless Architecture:** Built on an event-driven Webhook loop simulating Razorpay. It streams real-time state changes to the UI via STOMP WebSockets, handling high throughput effortlessly.

---

## ⚙️ Tech Stack
*   **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, Zustand, Recharts, @stomp/stompjs
*   **Backend:** Java 17, Spring Boot 3.2, Spring Data JPA, Hibernate, **Flyway (V1/V2 Migrations)**, WebSockets, **OpenAPI Swagger**
*   **Database:** PostgreSQL 16
*   **AI:** Google Gemini 2.5 Pro (Generative AI REST API)
*   **Deployment:** Docker Compose (multi-stage Alpine builds)
