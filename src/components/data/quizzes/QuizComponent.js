import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../../../firebase';
import { selfAwarenessQuiz } from '../../../data/quizzes/selfAwarenessQuiz';

// Rest of the component code remains the same