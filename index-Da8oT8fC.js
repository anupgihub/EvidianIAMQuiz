import { createRoot } from 'https://cdn.jsdelivr.net/npm/react-dom@18.2.0/+esm';

const questions = [
  {
    id: 1,
    type: "multiple",
    text: "What is a key feature of Evidian's Web Access Manager?",
    options: [
      "Clientless Single Sign-On for web applications",
      "Physical access control for factories",
      "Backup and replication services",
      "Intrusive application modification",
    ],
    correctAnswer: "Clientless Single Sign-On for web applications",
  },
  {
    id: 2,
    type: "long",
    text: "Explain how Evidian's Identity Governance and Administration (IGA) helps organizations manage user access and ensure compliance.",
    keywords: ["access requests", "compliance", "roles", "audit", "self-service"],
    maxScore: 10,
  },
  {
    id: 3,
    type: "multiple",
    text: "Which authentication method does Evidian Orbion support to enhance security?",
    options: [
      "Password-only authentication",
      "Multi-Factor Authentication (MFA) with FIDO2",
      "OpenID Connect exclusively",
      "Single password for all applications",
    ],
    correctAnswer: "Multi-Factor Authentication (MFA) with FIDO2",
  },
  {
    id: 4,
    type: "long",
    text: "Describe the benefits of Evidian's Single Sign-On (SSO) for enterprise users and IT departments.",
    keywords: ["one-click access", "security", "helpdesk", "productivity", "authentication"],
    maxScore: 10,
  },
];

function App() {
  const [answers, setAnswers] = React.useState({});
  const [scores, setScores] = React.useState(null);

  const handleMultipleChoice = (questionId, option) => {
    setAnswers({ ...answers, [questionId]: option });
  };

  const handleLongAnswer = (questionId, text) => {
    setAnswers({ ...answers, [questionId]: text });
  };

  const gradeLongAnswer = (answer, keywords, maxScore) => {
    if (!answer) return 0;
    const wordCount = answer.split(/\s+/).length;
    const matchedKeywords = keywords.filter((keyword) =>
      answer.toLowerCase().includes(keyword.toLowerCase())
    ).length;
    const keywordScore = (matchedKeywords / keywords.length) * maxScore * 0.7;
    const lengthScore = Math.min(wordCount / 50, 1) * maxScore * 0.3;
    return Math.round(keywordScore + lengthScore);
  };

  const submitQuiz = () => {
    let totalScore = 0;
    const maxTotalScore = questions.reduce(
      (sum, q) => sum + (q.type === "long" ? q.maxScore : 1),
      0
    );
    const questionScores = {};

    questions.forEach((question) => {
      if (question.type === "multiple") {
        const isCorrect = answers[question.id] === question.correctAnswer;
        questionScores[question.id] = isCorrect ? 1 : 0;
        totalScore += isCorrect ? 1 : 0;
      } else {
        const score = gradeLongAnswer(
          answers[question.id],
          question.keywords,
          question.maxScore
        );
        questionScores[question.id] = score;
        totalScore += score;
      }
    });

    setScores({ total: totalScore, maxTotal: maxTotalScore, questionScores });
  };

  const resetQuiz = () => {
    setAnswers({});
    setScores(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Evidian IAM Quiz App
        </h1>
        {scores ? (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Results</h2>
            <p className="text-lg mb-4">
              Total Score: {scores.total} / {scores.maxTotal}
            </p>
            {questions.map((q) => (
              <div key={q.id} className="mb-4">
                <p className="font-medium">{q.text}</p>
                <p>
                  Score: {scores.questionScores[q.id]}
                  {q.type === "long" ? ` / ${q.maxScore}` : ""}
                </p>
                {q.type === "multiple" && (
                  <p>Correct Answer: {q.correctAnswer}</p>
                )}
                <p>Your Answer: {answers[q.id] || "Not answered"}</p>
              </div>
            ))}
            <button
              onClick={resetQuiz}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Retake Quiz
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {questions.map((question) => (
              <div
                key={question.id}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <h2 className="text-xl font-semibold mb-4">{question.text}</h2>
                {question.type === "multiple" ? (
                  <div className="space-y-2">
                    {question.options.map((option) => (
                      <label key={option} className="flex items-center">
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={option}
                          checked={answers[question.id] === option}
                          onChange={() =>
                            handleMultipleChoice(question.id, option)
                          }
                          className="mr-2"
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                ) : (
                  <textarea
                    value={answers[question.id] || ""}
                    onChange={(e) =>
                      handleLongAnswer(question.id, e.target.value)
                    }
                    className="w-full p-2 border rounded-md"
                    rows="5"
                    placeholder="Type your answer here..."
                  />
                )}
              </div>
            ))}
            <button
              onClick={submitQuiz}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Submit Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(<App />);
