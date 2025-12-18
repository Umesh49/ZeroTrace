import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { quizCategories } from "./quizData_Shuffler";
import { FaArrowRight } from "react-icons/fa";
import "./CyberAwarenessQuiz.css";

function QuizCategorySelector() {
  const navigate = useNavigate();
  const [hackerEffect, setHackerEffect] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupCategory, setPopupCategory] = useState(null);

  useEffect(() => {
    const text = "CYBER SECURITY TRAINING";
    let iteration = 0;
    let interval = null;

    interval = setInterval(() => {
      const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+-=[]{}|;:,.<>?";
      let result = "";

      for (let i = 0; i < text.length; i++) {
        if (i < iteration) {
          result += text[i];
        } else {
          result += characters[Math.floor(Math.random() * characters.length)];
        }
      }

      setHackerEffect(result);

      if (iteration >= text.length) {
        clearInterval(interval);
      }

      iteration += 1 / 3;
    }, 30);

    return () => clearInterval(interval);
  }, []);

  const handleCategoryClick = (category) => {
    setPopupCategory(category);
    setShowPopup(true);
  };

  const handlePopupConfirm = () => {
    if (popupCategory) {
      navigate(`/quiz/${popupCategory.id}`);
    }
    setShowPopup(false);
    setPopupCategory(null);
  };

  const handlePopupCancel = () => {
    setShowPopup(false);
    setPopupCategory(null);
  };

  return (
    <div className="quiz-savdhan-root">
      <div className="quiz-savdhan-app">
        <div className="quiz-savdhan-container">
          <div className="quiz-savdhan-card">
            <div className="quiz-savdhan-header">
              <h1 className="quiz-savdhan-title page-title">{hackerEffect}</h1>
              <div className="quiz-savdhan-divider"></div>
              <p className="quiz-savdhan-subtitle">SELECT SECURITY PROTOCOL // INITIALIZE DEFENSE SYSTEMS</p>
            </div>

            <div className="quiz-savdhan-terminal">
              <span className="quiz-savdhan-prompt">root@security:~$</span>
              <span className="quiz-savdhan-typing-effect"> SELECT TRAINING MODULE</span>
            </div>

            <div className="quiz-savdhan-category-grid">
              {quizCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <div
                    key={category.id}
                    className="quiz-savdhan-category-card"
                    onClick={() => handleCategoryClick(category)}
                  >
                    <div className="quiz-savdhan-category-icon">
                      <Icon size={30} />
                    </div>
                    <h3 className="quiz-savdhan-category-title">{category.title}</h3>
                    <p className="quiz-savdhan-category-desc">{category.description}</p>
                    <div className="quiz-savdhan-category-questions">
                      <span className="quiz-savdhan-flicker-text">{category.questions} security tests</span>
                    </div>
                    <div className="quiz-savdhan-card-glow"></div>
                  </div>
                );
              })}
            </div>

            {showPopup && (
              <div className="quiz-savdhan-popup-overlay">
                <div className="quiz-savdhan-popup">
                  <h3 className="quiz-savdhan-popup-title">
                    Do you want to attempt the {popupCategory?.title} quiz?
                  </h3>
                  <div className="quiz-savdhan-popup-buttons">
                    <button
                      className="quiz-savdhan-btn quiz-savdhan-btn-primary"
                      onClick={handlePopupConfirm}
                    >
                      Yes <FaArrowRight className="quiz-savdhan-ml-2" />
                    </button>
                    <button
                      className="quiz-savdhan-btn quiz-savdhan-btn-outline"
                      onClick={handlePopupCancel}
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizCategorySelector;