export const selfAwarenessQuiz = {
  id: 'unified-situational-self-awareness',
  title: 'Unified Situational Self-Awareness Assessment',
  description: 'Discover your level of self-awareness through various scenarios.',
  questions: [
    {
      id: 'q1',
      question: 'After a heated argument with a family member:',
      options: [
        { value: 1, label: 'You quickly forget about it and move on with your day.' },
        { value: 2, label: "You feel upset but don't think much about why the argument happened." },
        { value: 3, label: 'You consider both perspectives and reflect on your emotional reactions.' },
        { value: 4, label: 'You analyze the underlying causes, your behavior, and gain clear insights into the family dynamic.' }
      ]
    },
    {
      id: 'q2',
      question: 'When facing an important life decision:',
      options: [
        { value: 1, label: 'You make a choice based on immediate circumstances without much thought.' },
        { value: 2, label: 'You list some pros and cons but struggle to understand your true motivations.' },
        { value: 3, label: 'You reflect on your values and try to understand your feelings about each option.' },
        { value: 4, label: 'You deeply examine your thoughts, emotions, and potential consequences, gaining clear insights into what matters most to you.' }
      ]
    },
    {
      id: 'q3',
      question: 'After receiving unexpected praise for your work:',
      options: [
        { value: 1, label: "You feel good but don't think much about it." },
        { value: 2, label: "You're pleased but unsure why your work was considered praiseworthy." },
        { value: 3, label: 'You reflect on what you did well and try to understand the impact of your actions.' },
        { value: 4, label: 'You gain clear insights into your strengths and how your approach positively affected others.' }
      ]
    },
    {
      id: 'q4',
      question: 'When feeling anxious about an upcoming event:',
      options: [
        { value: 1, label: 'You try to ignore the feeling and distract yourself.' },
        { value: 2, label: "You recognize you're anxious but can't pinpoint why." },
        { value: 3, label: 'You reflect on similar past experiences and consider possible reasons for your anxiety.' },
        { value: 4, label: 'You clearly understand the specific triggers of your anxiety and how they relate to your thoughts and past experiences.' }
      ]
    },
    {
      id: 'q5',
      question: 'After a failed attempt at learning a new skill:',
      options: [
        { value: 1, label: 'You give up without much thought about why you struggled.' },
        { value: 2, label: "You feel disappointed but don't analyze what went wrong." },
        { value: 3, label: 'You reflect on the challenges you faced and consider different approaches.' },
        { value: 4, label: 'You gain clear insights into your learning style, pinpointing specific areas for improvement and understanding your emotional responses to challenges.' }
      ]
    },
    {
      id: 'q6',
      question: 'When someone misunderstands your intentions:',
      options: [
        { value: 1, label: 'You get frustrated and blame them for not getting it.' },
        { value: 2, label: "You recognize there's a misunderstanding but are unsure how it happened." },
        { value: 3, label: 'You reflect on how you communicated and try to see things from their perspective.' },
        { value: 4, label: 'You gain clear insights into how your communication style might be perceived and understand the underlying assumptions on both sides.' }
      ]
    },
    {
      id: 'q7',
      question: "Upon realizing you've developed a bad habit:",
      options: [
        { value: 1, label: "You don't think much about it and continue as usual." },
        { value: 2, label: "You feel guilty but don't understand why you keep doing it." },
        { value: 3, label: 'You reflect on when and why you engage in this habit, considering its effects on you.' },
        { value: 4, label: 'You clearly understand the triggers, emotional needs the habit serves, and its impact on your life.' }
      ]
    },
    {
      id: 'q8',
      question: 'After achieving a long-term goal:',
      options: [
        { value: 1, label: 'You briefly celebrate and immediately focus on the next goal.' },
        { value: 2, label: "You feel satisfied but don't think much about the journey." },
        { value: 3, label: "You reflect on the challenges you overcame and how you've grown." },
        { value: 4, label: 'You gain deep insights into your personal growth, understanding how your values and motivations evolved throughout the process.' }
      ]
    },
    {
      id: 'q9',
      question: 'When feeling unexpectedly emotional during a movie:',
      options: [
        { value: 1, label: "You're surprised by your reaction but quickly forget about it after the movie." },
        { value: 2, label: "You notice your strong reaction but can't explain why that scene affected you so much." },
        { value: 3, label: 'You reflect on what aspects of the story resonated with you personally.' },
        { value: 4, label: "You gain clear insights into how the movie's themes connect to your own life experiences and values." }
      ]
    },
    {
      id: 'q10',
      question: 'Upon receiving constructive criticism:',
      options: [
        { value: 1, label: 'You dismiss it without much thought.' },
        { value: 2, label: "You feel hurt but don't analyze the feedback in depth." },
        { value: 3, label: 'You reflect on the feedback and consider how you might improve.' },
        { value: 4, label: 'You gain valuable insights into your blind spots, understanding both the feedback and your emotional response to it.' }
      ]
    }
  ],
  scoring: {
    ranges: [
      { min: 10, max: 20, level: 'Emerging Self-Awareness' },
      { min: 21, max: 30, level: 'Developing Self-Awareness' },
      { min: 31, max: 40, level: 'Advanced Self-Awareness' }
    ]
  }
};