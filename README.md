# Page Replacement Algorithm Simulator

A modern, interactive web application that visualizes and compares different page replacement algorithms used in operating systems. Built with Next.js, TypeScript, and Tailwind CSS.

![Page Replacement Simulator](https://img.shields.io/badge/Next.js-15.2.4-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?style=for-the-badge&logo=tailwind-css)

## 🚀 Features

### Interactive Algorithm Visualization
- **FIFO (First-In-First-Out)**: Visualizes the simplest page replacement algorithm
- **LRU (Least Recently Used)**: Shows how temporal locality affects page replacement
- **Optimal Algorithm**: Demonstrates the theoretical best-case scenario

### Advanced Simulation Controls
- **Real-time Animation**: Watch algorithms execute step-by-step with smooth animations
- **Playback Controls**: Play, pause, step forward, and reset simulations
- **Customizable Speed**: Adjust playback speed from 0.5x to 3x
- **Interactive Settings**: Toggle detailed explanations and customize display

### Educational Features
- **Visual Memory Representation**: Stack-based visualization of memory frames
- **Hit/Miss Tracking**: Real-time statistics with color-coded indicators
- **Performance Metrics**: Page fault ratios, hit ratios, and detailed statistics
- **Algorithm Explanations**: Comprehensive descriptions of each algorithm's behavior

### Modern UI/UX
- **Spotify-inspired Design**: Dark theme with green accent colors
- **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile devices
- **Smooth Animations**: CSS animations for page transitions and state changes
- **Accessible Components**: Built with accessibility in mind using Radix UI

## 🎯 What are Page Replacement Algorithms?

Page replacement algorithms are used in operating systems to manage memory efficiently. When a page fault occurs (a requested page is not in memory), these algorithms decide which page to remove from memory to make room for the new page.

### Key Concepts:
- **Page**: Fixed-size block of memory
- **Frame**: Physical memory slot that can hold a page
- **Page Fault**: Occurs when a requested page is not in memory
- **Hit Ratio**: Percentage of memory accesses that don't result in page faults

## 🛠️ Technologies Used

- **Frontend**: Next.js 15.2.4, React 19, TypeScript 5
- **Styling**: Tailwind CSS 3.4.17, Radix UI components
- **Icons**: Lucide React
- **Animations**: CSS animations and transitions
- **Development**: ESLint, PostCSS

## 📦 Installation

### Prerequisites
- Node.js 18.0 or later
- npm, yarn, or pnpm

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/aiswaryaamrithraj/Page-Replacement-simulator.git
   cd Page-Replacement-simulator
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 🎮 How to Use

### Getting Started
1. **Select an Algorithm**: Choose from FIFO, LRU, or Optimal on the homepage
2. **Configure Parameters**: 
   - Enter a reference string (comma-separated page numbers)
   - Set the number of frames (1-10)
3. **Run Simulation**: Click "Apply" to generate the simulation
4. **Control Playback**: Use play/pause, step forward, or reset controls

### Example Reference Strings
- **Simple**: `7,0,1,2,0,3,0,4,2,3,0,3,2,1,2,0,1,7,0,1`
- **Belady's Anomaly**: `3,2,1,0,3,2,4,3,2,1,0,4` (try with 3 and 4 frames)
- **Custom**: Create your own sequence of page numbers

### Understanding the Visualization
- **Green Highlighting**: Current page being accessed
- **Red Highlighting**: Page being replaced
- **HIT**: Page found in memory (no page fault)
- **MISS**: Page fault occurred (page not in memory)
- **Statistics Panel**: Real-time performance metrics

## 🧮 Algorithms Explained

### FIFO (First-In-First-Out)
- **Concept**: Replaces the oldest page in memory
- **Implementation**: Uses a queue structure
- **Pros**: Simple to implement
- **Cons**: May not perform well (Belady's Anomaly)

### LRU (Least Recently Used)
- **Concept**: Replaces the page that hasn't been used for the longest time
- **Implementation**: Tracks access times for each page
- **Pros**: Good performance in practice
- **Cons**: Requires additional hardware support

### Optimal Algorithm
- **Concept**: Replaces the page that won't be used for the longest time
- **Implementation**: Requires knowledge of future references
- **Pros**: Theoretical best performance
- **Cons**: Not implementable in real systems

## 📊 Performance Comparison

The simulator allows you to compare different algorithms with the same reference string and frame count. You can observe:

- **Page Fault Counts**: Total number of page faults
- **Hit Ratios**: Percentage of successful memory accesses
- **Memory Utilization**: How efficiently frames are used
- **Algorithm Behavior**: Step-by-step decision making

## 🎨 Customization

### Modifying Reference Strings
You can experiment with different page reference patterns:
- **Sequential**: `1,2,3,4,5,6,7,8,9,10`
- **Random**: `5,2,8,1,9,3,7,4,6,0`
- **Locality**: `1,1,2,2,3,3,1,1,2,2`

### Adjusting Frame Counts
Try different numbers of frames to see how memory size affects performance:
- **Few Frames** (1-2): More page faults, lower hit ratio
- **More Frames** (5-10): Fewer page faults, higher hit ratio

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm start
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

### Deploy to Netlify
```bash
npm run build
# Upload the 'out' folder to Netlify
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Guidelines
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Operating Systems Concepts**: Based on standard computer science curriculum
- **UI Components**: Built with Radix UI primitives
- **Design Inspiration**: Spotify's dark theme aesthetic
- **Educational Resources**: Computer Science textbooks and academic papers

## 📧 Contact

If you have any questions or suggestions, feel free to reach out:

- **GitHub Issues**: [Create an issue](https://github.com/aiswaryaamrithraj/Page-Replacement-simulator/issues)
- **Repository**: [https://github.com/aiswaryaamrithraj/Page-Replacement-simulator](https://github.com/aiswaryaamrithraj/Page-Replacement-simulator)

## 🔗 Related Resources

- [Operating System Concepts - Page Replacement](https://www.os-book.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Components](https://www.radix-ui.com/)

---

**Happy Learning! 🎓**

*This simulator is designed to help students and professionals understand page replacement algorithms through interactive visualization.*
