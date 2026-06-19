export interface KnowledgeChunk {
  id: string;
  category: 'about' | 'projects' | 'skills' | 'experience' | 'education' | 'resume' | 'contact' | 'general';
  title: string;
  content: string;
  tags: string[];
}

export const KNOWLEDGE_BASE: KnowledgeChunk[] = [
  {
    id: 'bio_about',
    category: 'about',
    title: 'Biography and Personal Profile of Bhuvanesh Chinthala',
    content: `Bhuvanesh Chinthala is an AI & Computer Vision Research Engineer. He is currently pursuing his undergraduate studies in Artificial Intelligence at Amrita Vishwa Vidyapeetham, Coimbatore, and is originally from Telangana, India.
Bhuvanesh is highly passionate about fusing creative design with artificial intelligence. His ultimate goal is to grow as an AI professional and contribute to impactful, technology-driven advancements. He designs and builds intelligent systems that do not just work, but think, inspire, and deliver outstanding real-time computational performance.`,
    tags: ['bio', 'about', 'bhuvanesh', 'amrita', 'student', 'pursuing', 'college']
  },
  {
    id: 'project_spar3d',
    category: 'projects',
    title: 'SPAR3D Project (3D Computer Vision)',
    content: `Project Name: SPAR3D (3D Vision)
Role: Computer Vision Engineer
Year: 2026
Tech Stack: Python, PyTorch, 3D Vision, Deep Learning.
Description: SPAR3D implements state-of-the-art 3D mesh reconstruction from single-view images. It reconstructs complete, high-quality 3D assets in less than 120ms with 98.4% IoU accuracy. SPAR3D improves upon the backside of the mesh by conditioning on a point cloud. It features a custom "Midnight Studio" user interface and optimized real-time edge processing.`,
    tags: ['projects', 'spar3d', '3d vision', 'pytorch', 'mesh', 'reconstruction', 'midnight studio']
  },
  {
    id: 'project_voltaic',
    category: 'projects',
    title: 'VoltAI Project (AI Smart Grid)',
    content: `Project Name: VoltAI (AI Smart Grid)
Role: AI Research Engineer
Year: 2026
Tech Stack: Python, TensorFlow, Streamlit, Mistral, Ollama.
Description: VoltAI is an advanced AI-powered smart grid control system that uses a multi-agent architecture with LLM reasoning (Mistral via local Ollama instances) to detect, analyze, and automatically resolve power grid violations. It maintains a 99.8% voltage stability index on standard IEEE bus grids, protecting grid infrastructure from severe overloads.`,
    tags: ['projects', 'voltaic', 'volt-ai', 'smart grid', 'mistral', 'ollama', 'multi-agent']
  },
  {
    id: 'project_rag_ai',
    category: 'projects',
    title: 'Multi-Agent RAG System',
    content: `Project Name: Multi-Agent RAG System (RAG AI)
Role: AI Developer
Year: 2026
Tech Stack: Python, Mistral, ChromaDB, Sentence Transformers.
Description: A powerful document Q&A and semantic search system supporting PDFs, text files, CSV, Excel, and images. It features a local LLM and a multi-agent framework of 6 concurrent agents: a Router, Ingestor, Query Planner, Refiner, Validator, and Writer. This ensures modular document ingestion and highly validated answers.`,
    tags: ['projects', 'rag', 'multi-agent', 'chromadb', 'embeddings', 'mistral']
  },
  {
    id: 'project_robopick',
    category: 'projects',
    title: 'RoboPick System (Robotics pick-and-place)',
    content: `Project Name: RoboPick System
Role: Robotics Engineer
Year: 2026
Tech Stack: Python, PyTorch, OpenCV, YOLOv5, Robotics.
Description: Real-time robotic pick-and-place system using YOLOv5 for biscuit detection and localization on a conveyor belt. It integrates a regression model to map 2D camera pixel coordinates directly to the coordinate space of an industrial XArm robotic arm. Features live video processing, automated gripping, and object placement.`,
    tags: ['projects', 'robopick', 'robotics', 'yolov5', 'opencv', 'xarm', 'gripping']
  },
  {
    id: 'project_brain3d',
    category: 'projects',
    title: 'Brain Tumor MRI 3D Segmentation',
    content: `Project Name: Brain 3D MRI Segmentation
Role: AI Researcher
Year: 2023 - 2024
Tech Stack: Python, PyTorch, Medical Imaging, 3D U-Net.
Description: A deep-learning medical imaging system for 3D brain tumor segmentation using MRI scans. It uses a 3D U-Net convolutional network to detect edema, tumor core, and enhancing regions across all MRI modalities. Achieves high Dice accuracy, supporting clinical workflows and medical diagnosis.`,
    tags: ['projects', 'brain 3d', 'mri', 'segmentation', 'u-net', 'medical imaging', 'tumor']
  },
  {
    id: 'project_few_shot',
    category: 'projects',
    title: 'Few-Shot Object Detection for Autonomous Driving',
    content: `Project Name: Few-Shot OD
Role: Machine Learning Researcher
Year: 2026
Tech Stack: Python, PyTorch, YOLOv5, OpenCV.
Description: Implements few-shot learning techniques to detect novel objects in autonomous driving scenarios. Utilizes a two-stage training approach with a CSPNet backbone and a Cosine Similarity Classifier for K-shot fine-tuning.
GitHub Repository: https://github.com/bhuvaneshchinthala/FEW-SHOT-LEARNING-`,
    tags: ['projects', 'few-shot', 'object detection', 'autonomous driving', 'github']
  },
  {
    id: 'project_telugu_nlp',
    category: 'projects',
    title: 'Telugu NLP Dialect Style Transfer',
    content: `Project Name: Telugu NLP Style Transfer
Role: NLP Researcher
Year: 2026
Tech Stack: Python, PyTorch, Hugging Face, RoBERTa.
Description: An automated dialect-specific sequence-to-sequence style transfer system for Telugu text transcripts, built using deep transformer backbones like RoBERTa. It dynamically rewrites transcripts into 9 customizable writing styles while perfectly preserving the original semantic meaning.
GitHub Repository: https://github.com/bhuvaneshchinthala/StyleRec-Benchmark-Dataset-for-Prompt-Recovery-in-Style-Transfer`,
    tags: ['projects', 'telugu', 'nlp', 'style transfer', 'roberta', 'hugging face', 'github']
  },
  {
    id: 'skills_core',
    category: 'skills',
    title: 'Core AI Skills and Technologies',
    content: `Bhuvanesh's skills span artificial intelligence, software architecture, and creative front-end design.
1. Core Competencies: Machine Learning Architecture, Deep Learning, Generative AI, Computer Vision, Natural Language Processing (NLP), and System Design.
2. Programming Languages & AI Frameworks: Python, PyTorch, TensorFlow, OpenCV, Hugging Face Transformers.
3. Web Development: Astro 5.0 (for ultra-fast Static Site Generation and serverless edge runtime), React 19 (for dynamic client-side hydration), Tailwind CSS v4, GSAP (GreenSock) scroll animations, Framer Motion (micro-interactions), Lenis Scroll, Three.js, and WebGL.`,
    tags: ['skills', 'tech stack', 'python', 'pytorch', 'tensorflow', 'astro', 'react', 'tailwind', 'gsap', 'framer motion']
  },
  {
    id: 'experience_timeline',
    category: 'experience',
    title: 'Professional Experience Timeline',
    content: `Bhuvanesh Chinthala's professional timeline:
- Lead ML Engineer @ SPAR3D (May, 2026 - Present): Focused on Computer Vision, designing PyTorch 3D reconstruction models and high-performance inference pipelines.
- System Architect @ VOLTAI (Aug, 2025 - May, 2026): Focused on Infrastructure, designing multi-agent smart grids with Mistral and Ollama LLM integration.
- Backend Developer @ RAG AI Systems (Oct, 2024 - Aug, 2025): Focused on NLP, developing vector databases, API gateways, and document ingestion models.
- Robotics Engineer Intern @ ROBOPICK (Sep, 2024 - Oct, 2024): Focused on Automation, implementing YOLOv5 models and mapping camera systems to industrial robot coordinate space.`,
    tags: ['experience', 'timeline', 'jobs', 'work', 'lead ml engineer', 'system architect', 'spar3d', 'voltaic', 'robopick']
  },
  {
    id: 'education_studies',
    category: 'education',
    title: 'Education and Studies',
    content: `Bhuvanesh is currently pursuing his undergraduate studies in Artificial Intelligence (AI) at Amrita Vishwa Vidyapeetham, Coimbatore, Tamil Nadu/India. He maintains a solid academic foundation combined with intensive practical research in Deep Learning and Computer Vision.`,
    tags: ['education', 'college', 'university', 'amrita vishwa vidyapeetham', 'degree', 'studies']
  },
  {
    id: 'resume_details',
    category: 'resume',
    title: 'Resume and Dossier Download',
    content: `Bhuvanesh Chinthala's resume details his experience as an AI & Computer Vision Research Engineer, his projects (SPAR3D, VoltAI, Multi-Agent RAG, RoboPick, MRI segmenter), skills (Python, PyTorch, React, Astro), and his studies at Amrita Vishwa Vidyapeetham.
You can download or view Bhuvanesh's resume by typing '/resume' in the chat, or navigate directly to the PDF Viewer Page at '/pdf-viewer' to read his academic papers and professional documents.`,
    tags: ['resume', 'download', 'pdf', 'dossier', 'pdf-viewer']
  },
  {
    id: 'contact_info',
    category: 'contact',
    title: 'Contact Information and Channels',
    content: `You can reach out to Bhuvanesh Chinthala through the following channels:
- Email: bhuvaneshchinthala0@gmail.com
- GitHub Profile: https://github.com/bhuvaneshchinthala
- LinkedIn: https://www.linkedin.com/in/bhuvanesh-chinthala
- Instagram: https://instagram.com/bhuvxnesh_26
- Contact Form: Submit a message using the interactive form located in the footer section at the bottom of the Home Page.`,
    tags: ['contact', 'email', 'github', 'linkedin', 'instagram', 'message', 'socials']
  },
  {
    id: 'site_features',
    category: 'general',
    title: 'Website Features and Custom Pages',
    content: `The portfolio website is designed with a premium, futuristic dark glassmorphism cyber-tech layout using Astro 5.0 and React.
Key site sections and sub-pages include:
- Home Page ('/'): Entry point with the interactive terminal, selected projects list, and contact gateways.
- About Page ('/about-me'): Dossier page showing his bio, vision, core competencies, experience timeline, and visual galleries.
- Tribute Page ('/cbum'): Dedicated bodybuilding tribute page styled with dark glassmorphism, parallax grids, and brand Ferrari Red (#ff2800) accents, celebrating athlete Chris Bumstead.
- System Board ('/system'): Interactive CPU, memory logging dashboard, and console outputs.
- PDF Viewer ('/pdf-viewer'): Custom document reader for loading and inspecting scientific files.
- Interactive Code Terminal: Homepage terminal simulation supporting command inputs, file system vault browsing, and code downloading.
- Futuristic Cursor: Custom cursor with mix-blend-difference spotlights, morphing modes, and plasma red trail energy.`,
    tags: ['website', 'pages', 'cbum', 'system', 'pdf-viewer', 'cursor', 'terminal']
  }
];
