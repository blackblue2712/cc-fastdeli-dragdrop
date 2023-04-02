## Getting Started

First, install dependencies by run the command `npm install`
Then run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Desc

### This repo using

- FE: nextjs, mobx, tailwindcss
- BE: express (for easy, I just mock a global class to store data, checkout pages/api folder for more information)

### Drag & drop:

- RECOMMEND use `react-spring` lib, for now I will implement it by vanilla JS (`EventStore.tsx`)
- We also can use draggable, drag events for this but I implement real drag drop by mouse events for more control (style, animation, ...) when moving element

### Data Structure: Event like Kafka, NatsIO JetStream

- When user interact with UI (add button, paragraph), fire an event & store it into `@actions`. This ovserable variable store all actions of user. Then compute final visible action to show in the UI. With this approach, we not lose any user actions, easy for implement undo & redo feature. (for more informaction, checkout `ActionStore.tsx` file)
