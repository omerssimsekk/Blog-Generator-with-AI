# AI Blog Generator

A modern, sleek web application that generates blog posts using AI. Built with Next.js, TypeScript, and TailwindCSS.

![AI Blog Generator]

## Features

- 🚀 Real-time blog post generation
- 💡 Multiple writing perspectives (Software Engineer, Student, Teacher, etc.)
- ✨ Modern, responsive UI with animations
- 🎨 Beautiful dark theme design
- ⚡ Streaming content generation
- 🛑 Ability to stop generation
- 📋 One-click copy functionality

## Tech Stack

- [Next.js 14](https://nextjs.org/) - React Framework
- [TypeScript](https://www.typescriptlang.org/) - Type Safety
- [TailwindCSS](https://tailwindcss.com/) - Styling
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [DeepSeek API](https://deepseek.com/) - AI Text Generation

## Getting Started

1. Clone the repository: https://github.com/omerssimsekk/Blog-Generator-with-AI
```bash
git clone 
cd blogenerator
```

2. Install dependencies:
```bash
# Install all required packages
npm install

# Install specific dependencies if any are missing
npm install @heroicons/react framer-motion axios clsx tailwind-merge
npm install -D @tailwindcss/typography
```

3. Set up Tailwind CSS (if not already configured):
```bash
# Initialize Tailwind CSS
npx tailwindcss init -p
```

4. Create a `.env.local` file in the root directory and add your DeepSeek API key:
```env
DEEPSEEK_API_KEY=your_api_key_here
```


7. Run the development server:
```bash
npm run dev
```

8. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

- `DEEPSEEK_API_KEY` - Your DeepSeek API key (required)

## Usage

1. Enter a blog title (optional)
2. Add keywords separated by commas (optional)
3. Select a writing perspective
4. Click "Generate Blog Post"
5. Wait for the AI to generate your content
6. Copy the generated content with one click
7. Stop generation at any time if needed

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
