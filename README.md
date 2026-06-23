# Personalized Language Islands

**Live app:** [deanofwalls.github.io/lingua-islands](https://deanofwalls.github.io/lingua-islands/)

## Overview

Personalized Language Islands is a language-learning system based on building practical fluency around the learner's real daily life.

Instead of starting with grammar drills, random vocabulary, or generic app lessons, the learner creates small topic-based "islands" of useful sentences they actually say, hear, think, or need in real situations.

The system focuses on:

* Personalized sentence collection
* Daily-life immersion
* Audio repetition
* Shadowing
* Active recall
* Real-world usage
* Continuous sentence expansion

The goal is to help a learner become conversational faster by practicing the language they personally need most.

---

## Core Idea

A language should not be learned as one giant abstract subject.

Instead, it should be built as a collection of useful islands:

* Relationship island
* Food island
* Work island
* Home island
* Opinion island
* Hobbies island
* Survival/travel island

Each island contains sentences the learner can immediately use.

Over time, the islands connect through repeated grammar patterns, shared vocabulary, and daily usage.

---

## Problem

Most beginner language learners waste time on:

* Random vocabulary
* App streaks
* Grammar-first learning
* Passive immersion they cannot understand
* Textbook phrases they never use
* Memorizing words without context

This creates learners who may recognize words but cannot speak naturally.

---

## Solution

Build a personal database of full sentences from the learner's actual life.

Each sentence should include:

* English sentence
* Target-language sentence
* Pinyin or pronunciation guide
* Optional literal translation
* Audio
* Island/category
* Difficulty
* Review status

Example:

```text
English: What do you want to eat?
Chinese: 你想吃什么？
Pinyin: nǐ xiǎng chī shén me
Island: Food / Cooking
```

---

## Learning Flow

### 1. Capture Real Life

The learner writes or records things they naturally say during the day.

Examples:

* I'm tired.
* Are you hungry?
* I have a meeting.
* This code is annoying.
* Where is my phone?
* I need to go grocery shopping.

These become the foundation of the system.

---

### 2. Organize Into Islands

Sentences are grouped by real-life context.

Initial islands:

1. Girlfriend / Relationship
2. Food / Cooking
3. Morning / Night Routine
4. Work / Programming
5. Home / Daily Life
6. Opinions / Personality
7. Questions
8. Future Plans
9. Past Stories
10. Survival Mandarin

---

### 3. Translate Sentences

Each sentence is translated into the target language.

For Mandarin, each item should include:

* English
* Simplified Chinese
* Pinyin
* Optional notes

---

### 4. Generate Audio

Each sentence should eventually have audio.

Audio can be used for:

* Passive listening
* Shadowing
* Pronunciation practice
* Review while commuting or doing chores

---

### 5. Listen Daily

The learner listens to their own sentence database repeatedly.

This creates personalized immersion.

Instead of listening to random native content that is mostly incomprehensible, the learner hears language directly mapped to their own life.

---

### 6. Shadow

The learner repeats sentences out loud while listening.

The goal is to copy:

* Pronunciation
* Rhythm
* Speed
* Tone
* Flow

This trains the mouth, not just the brain.

---

### 7. Active Recall

The learner sees the English sentence and tries to produce the target-language sentence from memory.

Example:

```text
Prompt: What do you want to eat?
Answer: 你想吃什么？
```

The learner checks the answer, corrects mistakes, and repeats.

This is the core skill-building loop.

---

### 8. Use In Real Life

The learner should replace English with the target language whenever possible.

Example:

Instead of saying:

```text
Are you hungry?
```

Say:

```text
你饿了吗？
```

Any time the learner cannot say something, they add it to the sentence database.

---

## Initial MVP Features

### Sentence Database

Each sentence should support:

* English
* Target language
* Pinyin/pronunciation
* Island/category
* Notes
* Favorite/starred status
* Mastery level

---

### Island View

Display sentences grouped by island.

Example islands:

* Relationship
* Food
* Work
* Home
* Opinions

---

### Flashcard Mode

Show English first.

User attempts to recall the target sentence.

Then reveal:

* Chinese
* Pinyin
* Notes

---

### Daily Practice Mode

Randomly serve sentences from selected islands.

Options:

* Practice all
* Practice weak sentences
* Practice one island
* Practice favorites

---

### Audio Mode

Play sentence audio for listening practice.

Future options:

* Play English first, then target language
* Play target language only
* Loop island
* Shuffle all sentences
* Shadowing mode

---

## Future Features

* Text-to-speech generation
* Speech recording
* Pronunciation comparison
* Spaced repetition
* Import/export JSON
* GitHub Pages local storage
* CSV import
* Mobile-friendly PWA
* Progress dashboard
* Daily streaks without gamifying too heavily
* Native speaker correction notes
* Transcript-based native content study

---

## Data Model

```json
{
  "id": "food-001",
  "island": "Food / Cooking",
  "english": "What do you want to eat?",
  "target": "你想吃什么？",
  "pinyin": "nǐ xiǎng chī shén me",
  "notes": "Common casual question.",
  "mastery": 0,
  "favorite": false,
  "audioUrl": ""
}
```

---

## Mastery Levels

```text
0 = New
1 = Recognized
2 = Can say slowly
3 = Can say naturally
4 = Automatic
```

---

## Initial Sentence Loadout

### Relationship

* I love you.
* I miss you.
* Come here.
* Sit with me.
* Give me a kiss.
* Give me a hug.
* You're cute.
* You're annoying.
* I'm joking.
* Are you mad?
* What's wrong?
* Tell me.
* Say it again.
* Speak slower.
* You're right.
* I was wrong.

### Food

* Are you hungry?
* I'm hungry.
* What do you want to eat?
* What should we cook tonight?
* I'm cooking.
* Dinner is almost ready.
* Taste this.
* Is it good?
* Too spicy.
* Too salty.
* I'm full.
* Let's buy groceries.
* Do we need anything?

### Daily Life

* I'm tired.
* I'm sleepy.
* I'm busy.
* I'm going to sleep.
* I need to shower.
* Wait a minute.
* I'll be right back.
* Where is my phone?
* Help me.
* I forgot.
* I know.
* I don't know.

### Work

* I have work today.
* I have a meeting.
* My meeting is boring.
* I'm writing code.
* My code doesn't work.
* I found the problem.
* I fixed it.
* This makes no sense.
* Let me test it.
* It works now.

### Opinions

* I think...
* I don't think so.
* Why?
* Because...
* Maybe.
* I agree.
* I disagree.
* That's stupid.
* That's interesting.
* That's funny.
* I have an idea.
* Explain it to me.
* Let me think.

---

## Design Goals

* Practical over academic
* Real-life usage over textbook order
* Sentences over isolated vocabulary
* Speaking and listening over passive recognition
* Small daily practice over massive occasional study
* Personal relevance over generic curriculum

---

## Non-Goals

This project is not intended to be:

* A full grammar textbook
* A dictionary
* A Duolingo clone
* A generic course platform
* A replacement for native-speaker interaction

---

## Success Criteria

The project is successful if the learner can:

* Recall common daily sentences without translating word-by-word
* Use Mandarin naturally in repeated daily contexts
* Build new sentences from familiar patterns
* Understand their own sentence audio at normal speed
* Expand the system whenever they encounter a missing phrase

---

## Core Loop

```text
Capture real sentence
→ Translate it
→ Add to island
→ Listen repeatedly
→ Shadow aloud
→ Recall from English
→ Use in real life
→ Add missing sentences
```

---

## Project Name Ideas

* Language Islands
* Personal Fluency
* IslandSpeak
* SpeakMap
* Daily Mandarin OS
* Fluency Islands
* LifePhrase
* MyLanguageOS

---

## Recommended MVP Stack

For a quick GitHub Pages version:

* HTML
* CSS
* JavaScript
* Local JSON file
* Browser localStorage for progress

No backend is required for MVP.

---

## MVP Pages

```text
index.html
style.css
app.js
sentences.json
design-document.md
```

---

## MVP User Flow

1. User opens the site.
2. User selects an island.
3. Site shows one English sentence.
4. User tries to say the Mandarin sentence.
5. User clicks reveal.
6. Site shows Chinese and pinyin.
7. User marks difficulty/mastery.
8. Site loads the next sentence.

---

## Long-Term Vision

The long-term goal is to create a personalized immersion engine.

The learner should be able to feed the app their actual life, thoughts, conversations, and interests, then turn that into structured daily practice material.

The app should help the learner build fluency around who they actually are.
