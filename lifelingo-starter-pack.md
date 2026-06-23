# LifeLingo Mandarin Starter Pack

## Purpose

This starter pack is designed for a complete beginner learning Mandarin through the **Personal Language Islands** method.

The goal is not to memorize random vocabulary. The goal is to build a usable Mandarin environment around the learner's actual life.

The app should help the learner:

- Learn full useful sentences first
- Understand the reusable sentence patterns inside those sentences
- Practice daily speaking and listening
- Use Mandarin in real situations
- Expand the sentence database whenever they discover something they cannot say

---

## Core Method

The system works like this:

```text
Real-life sentence
→ Mandarin version
→ Pinyin with tones
→ Literal meaning
→ Word breakdown
→ Sentence structure explanation
→ Audio/shadowing
→ Active recall
→ Real-life use
```

The learner should not start by asking, "What grammar rule should I study today?"

They should ask:

```text
What do I actually say every day that I cannot say in Mandarin yet?
```

Those sentences become the curriculum.

---

## Language Islands

A **language island** is a small area of life where the learner can function in Mandarin.

Example islands:

- Relationship / Girlfriend
- Food / Cooking
- Morning / Night Routine
- Home / Daily Life
- Work / Programming
- Opinions / Personality
- Questions / Conversation Control
- Shopping / Errands
- Time / Plans
- Mandarin Survival Phrases

Each island should contain sentences the learner can actually use.

The first goal is not broad fluency. The first goal is island fluency.

Example:

```text
Food Island:
- Are you hungry?
- What do you want to eat?
- I am cooking.
- Taste this.
- Too salty.
- Too spicy.
- I am full.
```

When enough islands connect, broader fluency begins to form naturally.

---

## Beginner Mandarin Concepts Used In This Pack

This starter pack introduces Mandarin through useful patterns.

### 1. Basic Word Order

Mandarin often uses:

```text
Subject + Verb + Object
```

Example:

```text
我爱你。
wǒ ài nǐ
I love you.
```

Literal:

```text
I love you
```

This is similar to English.

---

### 2. Questions With 吗

To make many yes/no questions, Mandarin can add **吗 (ma)** to the end of a statement.

Example:

```text
你忙。
nǐ máng
You are busy.
```

Question:

```text
你忙吗？
nǐ máng ma
Are you busy?
```

Pattern:

```text
Statement + 吗 = yes/no question
```

---

### 3. Change Of State With 了

**了 (le)** often shows that something has changed or become true.

Example:

```text
我饿了。
wǒ è le
I am hungry now.
```

Literal:

```text
I hungry changed-state
```

It often appears in everyday phrases:

```text
我累了。= I am tired now.
我困了。= I am sleepy now.
你饿了吗？= Are you hungry now?
```

Do not over-study 了 at the beginning. Learn it through repeated sentences.

---

### 4. Want / Intend With 要

**要 (yào)** can mean want, need, or going to, depending on context.

Example:

```text
我要睡觉。
wǒ yào shuì jiào
I want to sleep / I am going to sleep.
```

Pattern:

```text
我要 + action
```

---

### 5. Want / Feel Like With 想

**想 (xiǎng)** means want to, would like to, think, or miss, depending on the sentence.

Example:

```text
我想吃饭。
wǒ xiǎng chī fàn
I want to eat.
```

With a person:

```text
我想你了。
wǒ xiǎng nǐ le
I miss you.
```

---

### 6. Softening Actions With 一下

**一下 (yí xià)** means to do something briefly, once, or for a moment.

It makes requests sound more natural and less harsh.

Examples:

```text
等一下。
děng yí xià
Wait a moment.
```

```text
看一下。
kàn yí xià
Take a look.
```

```text
亲一下。
qīn yí xià
Give a quick kiss / kiss once.
```

---

### 7. Descriptions Usually Use 很

In Mandarin, descriptions often use **很 (hěn)** even when English uses "is/am/are."

Example:

```text
你很可爱。
nǐ hěn kě ài
You are cute.
```

Literal:

```text
You very cute
```

In many beginner sentences, **很** works like a natural linker before adjectives.

---

### 8. Location With 在

**在 (zài)** means at, in, on, or located at.

Example:

```text
我的手机在哪里？
wǒ de shǒu jī zài nǎ lǐ
Where is my phone?
```

Literal:

```text
My phone located where?
```

---

### 9. Possession With 的

**的 (de)** often connects a possessor to a thing.

Example:

```text
我的手机
wǒ de shǒu jī
my phone
```

Literal:

```text
I's phone
```

---

### 10. Ability / Permission With 可以

**可以 (kě yǐ)** means can, may, or be allowed to.

Example:

```text
你可以帮我吗？
nǐ kě yǐ bāng wǒ ma
Can you help me?
```

Pattern:

```text
你可以 + action + 吗？
```

---

## How Cursor Should Use The JSON Data

The JSON file is not just a list of translations. It is the curriculum engine.

Each sentence contains:

- `id`: stable unique identifier
- `islandId`: which life island it belongs to
- `english`: prompt shown first in flashcard mode
- `hanzi`: Mandarin characters
- `pinyin`: tone-mark pinyin
- `pinyinNumbered`: tone-number pinyin for search/sorting if needed
- `literal`: word-order style translation
- `meaning`: natural English meaning
- `difficulty`: beginner difficulty level
- `tags`: searchable tags
- `patternIds`: grammar/pattern connections
- `breakdown`: word-by-word explanation
- `structureNotes`: sentence structure explanation
- `usageNotes`: when/how to use it naturally
- `examples`: related example sentences

---

## Recommended App Features For GitHub Pages MVP

### 1. Island Browser

Display all islands.

When the user clicks an island, show sentences from that island.

### 2. Flashcard Mode

Default flashcard flow:

1. Show English sentence
2. User tries to say Mandarin aloud
3. User clicks reveal
4. Show Hanzi, pinyin, literal translation, and explanation
5. User marks mastery

Mastery values:

```text
0 = New
1 = Recognize it
2 = Can say slowly
3 = Can say naturally
4 = Automatic
```

Store mastery in `localStorage` keyed by sentence id.

### 3. Sentence Detail View

For each sentence, show:

- English
- Hanzi
- Pinyin
- Literal translation
- Word breakdown
- Pattern explanation
- Related examples
- Usage notes

### 4. Pattern View

Patterns should be reusable across islands.

Example:

```text
Pattern: 我想 + action
Meaning: I want to / I feel like
Examples:
- 我想吃饭。
- 我想睡觉。
- 我想喝咖啡。
```

This helps the learner build new sentences instead of memorizing each phrase as a disconnected item.

### 5. Audio / Shadowing Mode

For MVP, use the browser's SpeechSynthesis API if available.

Suggested behavior:

- Speak Hanzi using `zh-CN`
- Add replay button
- Add slow/repeat mode if possible
- Add shadowing mode that displays: Listen → Repeat → Next

If browser TTS is unreliable, leave the audio field empty and design the app so real audio files can be added later.

### 6. Search

Search should match:

- English
- Hanzi
- Pinyin
- Tags
- Island name
- Pattern id

Useful searches:

```text
hungry
想
xiang
food
question
ma-question
```

### 7. Practice Filters

Allow practice by:

- Island
- Pattern
- Mastery level
- Favorites
- Difficulty
- Weak sentences

### 8. Data-Driven UI

Do not hardcode sentence content into components.

Load the JSON and render dynamically.

The code should treat the JSON as the source of truth.

---

## Recommended File Structure

```text
/lifelingo
  index.html
  style.css
  app.js
  starter-pack.json
  lifelingo-starter-pack.md
```

Optional future structure:

```text
/data
  mandarin-starter-pack.json
/audio
  relationship-001.mp3
  food-001.mp3
```

---

## MVP Screen Layout

### Home

```text
LifeLingo
Learn the language of your own life.

[Practice All]
[Browse Islands]
[Browse Patterns]
[Review Weak Sentences]
```

### Island Card

```text
Relationship / Girlfriend
Daily partner communication
24 sentences
[Practice]
[Browse]
```

### Flashcard

```text
What do you want to eat?

[Reveal]
```

After reveal:

```text
你想吃什么？
nǐ xiǎng chī shén me
Literal: You want eat what?

Pattern: 你想 + action + 什么？

[Again] [Hard] [Good] [Easy]
```

---

## Beginner Study Instructions

Daily minimum:

```text
10 minutes active recall
10 minutes listening/shadowing
Use 3 real sentences with girlfriend or out loud
```

Daily ideal:

```text
Morning: listen to one island
Lunch: active recall 10-15 min
Evening: shadow + review weak sentences
Real life: replace English with Mandarin when possible
```

Rule:

```text
If you know the Mandarin, do not say the English.
```

Example:

Instead of:

```text
Are you hungry?
```

Say:

```text
你饿了吗？
```

---

## Expansion Rule

Any time the learner thinks:

```text
How do I say this in Mandarin?
```

That sentence should be added to the database.

Add it with:

- English
- Hanzi
- Pinyin
- Literal translation
- Breakdown
- Pattern ids
- Usage notes

This makes the app increasingly personalized over time.

---

## First Milestone

The first milestone is not fluency.

The first milestone is:

```text
100 daily-life sentences that can be understood, spoken slowly, and used in context.
```

Once those are automatic, expand to:

- Past stories
- Future plans
- Deeper opinions
- Arguments/disagreements
- Family conversations
- More native content support

