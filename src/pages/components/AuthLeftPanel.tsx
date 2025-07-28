import React from "react";

const AuthLeftPanel = () => (
  <div className="hidden md:flex flex-col justify-center items-start w-1/2 bg-[#4B187C] px-16 py-12 text-white min-h-full">
    <h1 className="text-5xl font-bold mb-4">Welcome to<br/>Memorabid</h1>
    <p className="mb-8 text-lg opacity-90 max-w-md">
      A platform designed to help you ace interviews with personalized practice, instant feedback, and expert guidance.
    </p>
    <ul className="mb-8 space-y-4">
      <li className="flex items-center gap-3 text-base"><span className="text-green-400">✔</span> Interactive mock interviews with AI-driven feedback</li>
      <li className="flex items-center gap-3 text-base"><span className="text-blue-300">👥</span> Connect with industry professionals</li>
      <li className="flex items-center gap-3 text-base"><span className="text-yellow-300">🎓</span> Personalized coaching & resources</li>
    </ul>
    <blockquote className="italic text-sm opacity-80 max-w-md mb-2">“InterviewPro helped me land my dream job by building my confidence and skills.”</blockquote>
    <span className="font-bold text-base">– Alex, Software Engineer</span>
  </div>
);

export default AuthLeftPanel; 