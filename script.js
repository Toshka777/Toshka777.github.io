const questions = [
  {
      question: "يمثل اللبن ---- من الدخل الزراعي",
      options: ["50%", "40%", "60%", "25%"],
      correctAnswer: "25%"
  },
  {
      question: "ما هي أكبر دولة في إنتاج لبن الجاموس؟",
      options: ["الصين", "الهند", "مصر", "أمريكا"],
      correctAnswer: "الهند"
  },
  {
      question: "يتم إنتاج لبن الأغنام في مصر بنسبة",
      options: ["10%", "5%", "1%", "3%"],
      correctAnswer: "1%"
  },
  {
      question: "يتم إنتاج لبن الماعز بنسبة",
      options: ["2%", "0.5%", "25%", "20%"],
      correctAnswer: "0.5%"
  },
  {
      question: "نسبة الأحماض الدهنية المشبعة",
      options: ["20%", "30%", "60%", "40%"],
      correctAnswer: "60%"
  },
  {
      question: "نسبة الدهون الحقيقية في اللبن",
      options: ["50%", "2%", "98%", "94%"],
      correctAnswer: "98%"
  },
  {
      question: "أكثر الأحماض الدهنية المشبعة في اللبن هو",
      options: ["حمض الأوليك", "حمض البالمتيك", "حمض اللينويك"],
      correctAnswer: "حمض البالمتيك"
  },
  {
      question: "الكازين يمثل ---- من بروتين اللبن",
      options: ["20%" , "50%", "90%" , "80%"],
      correctAnswer: "80%"
  },
  {
      question: "يزداد انزيم ---- في حالة حدوث التهاب الضرع",
      options: ["الكتاليز", "الفوسفاتيز", "الليبين", "السيروكسيديز"],
      correctAnswer: "الكتاليز"
  },
  {
      question: "أكثر الأحماض الدهنية الغير مشبعة انتشاراً في اللبن",
      options: ["حمض الأوليك", "حمض البالمتيك", "حمض الأركيدونيك", "حمض الاستياريك"],
      correctAnswer: "حمض الأوليك"
  }
];

let currentQuestionIndex = 0; // مؤشر السؤال الحالي
let score = 0; // درجة المستخدم
let userAnswers = []; // تخزين إجابات المستخدم
let timer; // مؤقت الامتحان
const examDuration = 60 * 60 * 1000; // مدة الامتحان ساعة واحدة بالمللي ثانية

const welcomeContainer = document.querySelector(".welcome-container"); // عنصر يحتوي على شاشة الترحيب
const formContainer = document.querySelector(".form-container"); // عنصر يحتوي على الفورم
const questionsContainer = document.getElementById("questions-container"); // عنصر يحتوي على الأسئلة
const nextButton = document.getElementById("next-button"); // زر الانتقال للسؤال التالي
const resultContainer = document.getElementById("result"); // عنصر لعرض النتيجة النهائية
const timerContainer = document.getElementById("timer"); // عنصر لعرض المؤقت

// إخفاء شاشة الترحيب بعد 3 ثواني وعرض الفورم
setTimeout(() => {
  welcomeContainer.classList.add("hidden");
  setTimeout(() => {
    welcomeContainer.style.display = "none";
    formContainer.style.display = "block";
    formContainer.classList.add("visible");
  }, 1300); // تأخير لإخفاء شاشة الترحيب بشكل كامل
}, 1500);

document.getElementById("user-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const namePattern = /^[a-zA-Z\u0600-\u06FF\s]+$/; // نمط للتحقق من أن الاسم يحتوي على حروف فقط (عربية أو إنجليزية)

  if (!namePattern.test(username)) {
    alert("الرجاء إدخال اسم صحيح بدون أرقام.");
    return;
  }

  formContainer.style.display = "none"; // إخفاء الفورم بدون أنيميشن
  const container = document.querySelector(".container");
  container.style.display = "block";
  container.classList.add("visible");
  startTimer(examDuration); // بدء المؤقت
  showQuestion(currentQuestionIndex);
});

function startTimer(duration) {
  let startTime = Date.now();
  timer = setInterval(() => {
    let elapsedTime = Date.now() - startTime;
    let remainingTime = duration - elapsedTime;
    if (remainingTime <= 0) {
      clearInterval(timer);
      showResult();
    } else {
      let minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
      timerContainer.textContent = `الوقت المتبقي: ${minutes} دقيقة و ${seconds} ثانية`;
    }
  }, 1000);
}

function showQuestion(index) {
  questionsContainer.innerHTML = ""; // تفريغ محتوى عنصر الأسئلة
  const question = questions[index]; // الحصول على السؤال الحالي
  const questionDiv = document.createElement("div"); // إنشاء عنصر جديد للسؤال
  questionDiv.classList.add("question"); // إضافة فئة CSS للسؤال

  const questionTitle = document.createElement("h2"); // إنشاء عنصر لعنوان السؤال
  questionTitle.textContent = question.question; // تعيين نص السؤال
  questionDiv.appendChild(questionTitle); // إضافة عنوان السؤال إلى عنصر السؤال

  const optionsDiv = document.createElement("div"); // إنشاء عنصر جديد للخيارات
  optionsDiv.classList.add("options"); // إضافة فئة CSS للخيارات

  question.options.forEach((option) => {
    const button = document.createElement("button"); // إنشاء زر لكل خيار
    button.textContent = option; // تعيين نص الخيار
    button.addEventListener("click", () => {
      // إضافة مستمع للنقر على الزر
      userAnswers[index] = option; // تخزين إجابة المستخدم
      document.querySelectorAll(".options button").forEach((btn) => {
        btn.classList.remove("selected"); // إزالة الفئة من جميع الأزرار
      });
      button.classList.add("selected"); // إضافة الفئة للزر المحدد
      nextButton.style.display = "block"; // عرض زر الانتقال للسؤال التالي
      if (currentQuestionIndex === questions.length - 1) {
        nextButton.textContent = "تسليم الاختبار"; // تغيير نص الزر في السؤال الأخير
      }
    });
    optionsDiv.appendChild(button); // إضافة الزر إلى عنصر الخيارات
  });

  questionDiv.appendChild(optionsDiv); // إضافة عنصر الخيارات إلى عنصر السؤال
  questionsContainer.appendChild(questionDiv); // إضافة عنصر السؤال إلى عنصر الأسئلة
}

nextButton.addEventListener("click", () => {
  // إضافة مستمع للنقر على زر الانتقال للسؤال التالي
  currentQuestionIndex++; // زيادة مؤشر السؤال الحالي
  if (currentQuestionIndex < questions.length) {
    showQuestion(currentQuestionIndex); // عرض السؤال التالي
    nextButton.style.display = "none"; // إخفاء زر الانتقال للسؤال التالي
  } else {
    showResult(); // عرض النتيجة النهائية
  }
});

function showResult() {
  clearInterval(timer); // إيقاف المؤقت
  questionsContainer.style.display = "none"; // إخفاء عنصر الأسئلة
  nextButton.style.display = "none"; // إخفاء زر الانتقال للسؤال التالي
  resultContainer.style.display = "block"; // عرض عنصر النتيجة النهائية

  let resultHTML = `<h2>نتائج الاختبار</h2>`;
  questions.forEach((question, index) => {
    if (userAnswers[index] !== undefined) {
      const userAnswer = userAnswers[index];
      const correctAnswer = question.correctAnswer;
      const isCorrect = userAnswer === correctAnswer;
      if (isCorrect) score++;
      resultHTML += `
        <div class="result-question">
          <h3>${question.question}</h3>
          <p>إجابتك: ${userAnswer} ${isCorrect ? "(صحيحة)" : "(خاطئة)"}</p>
          ${!isCorrect ? `<p>الإجابة الصحيحة: ${correctAnswer}</p>` : ""}
        </div>
      `;
    }
  });

  resultHTML += `<p>لقد أجبت بشكل صحيح على ${score} من ${questions.length} أسئلة.</p>`;
  resultContainer.innerHTML = resultHTML;

  if (navigator.onLine) {
    sendEmail(userAnswers);
    resultContainer.innerHTML += `<p style="color: green; font-weight: bold;">تم إرسال الإجابات بنجاح.</p>`;
  } else {
    localStorage.setItem("userAnswers", JSON.stringify(userAnswers));
    resultContainer.innerHTML += `<p style="color: red; font-weight: bold;">لم يتم إرسال الإجابات لأنك غير متصل بالإنترنت.</p>`;
  }
}

function sendEmail(answers) {
  const username = document.getElementById("username").value;
  const templateParams = {
    to_email: "yta861356@gmail.com",
    from_name: username,
    message: `اسم الطالب: ${username}\nالنتيجة: ${JSON.stringify(answers)}`,
  };

  fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      service_id: "service_hufi8li",
      template_id: "template_1iaohnh",
      user_id: "hX0tBR1huam3gEj78",
      template_params: templateParams,
    }),
  })
    .then((response) => {
      if (response.ok) {
        console.log("SUCCESS!", response.status, response.text());
      } else {
        console.log("FAILED...", response.status, response.text());
      }
    })
    .catch((error) => {
      console.log("FAILED...", error);
    });
}

window.addEventListener("online", () => {
  const storedAnswers = localStorage.getItem("userAnswers");
  if (storedAnswers) {
    sendEmail(JSON.parse(storedAnswers));
    localStorage.removeItem("userAnswers");
  }
});
