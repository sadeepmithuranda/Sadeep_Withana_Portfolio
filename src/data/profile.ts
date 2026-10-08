export const profile = {
  name: 'Sadeep Withana',
  firstName: 'Sadeep',
  degree: 'BSc (Hons) in Computer Engineering',
  faculty: 'Faculty of Computing',
  university: 'General Sir John Kotelawala Defence University (KDU)',
  universityShort: 'KDU',
  country: 'Sri Lanka',
  headline: 'Computer Engineering Undergraduate | TinyML | IoT | Embedded Systems | Edge AI | Robotics',
  intro:
    'I build intelligent hardware-software systems at the intersection of embedded computing, IoT, edge AI, and robotics.',
  introMore:
    'Most of what I enjoy happens between a sensor and a decision: wiring up a microcontroller, getting clean data off it, squeezing a machine learning model onto the chip, and connecting the whole thing so it does something useful in the real world.',
  identities: [
    'Computer Engineering Undergraduate',
    'Embedded Systems Enthusiast',
    'TinyML & Edge AI Enthusiast',
    'IoT Developer',
    'Robotics Enthusiast',
    'Edge Computing Enthusiast',
    'Hardware & Firmware Developer',
    'AI/ML Explorer',
    'Cloud & DevOps Learner',
    'Undergraduate Researcher',
  ],
};

/** "What I Build" — the stack from physical signal to application. */
export const buildChain = [
  {
    id: 'sensors',
    label: 'Sensors',
    tech: ['MPU6050 IMU', 'AD8232 ECG', 'DHT', 'MQ gas', 'Ultrasonic', 'Soil moisture', 'IR'],
    projects: ['fall-detection-system', 'tinyml-af-detection', 'garden-watering-robot'],
    note: 'Getting trustworthy data from the physical world.',
  },
  {
    id: 'mcu',
    label: 'Microcontrollers',
    tech: ['ESP32', 'ESP32-S3', 'ESP8266 / NodeMCU', 'Arduino'],
    projects: ['iot-sensor-builds', 'garden-watering-robot'],
    note: 'Small chips with tight memory and real-time constraints.',
  },
  {
    id: 'embedded',
    label: 'Embedded Intelligence',
    tech: ['C/C++ firmware', 'RTOS basics', 'Signal processing', 'Hardware interfacing'],
    projects: ['fall-detection-system', 'garden-watering-robot'],
    note: 'Firmware that turns raw readings into decisions.',
  },
  {
    id: 'tinyml',
    label: 'TinyML / Edge AI',
    tech: ['TensorFlow Lite Micro', '1D CNN', 'INT8 quantization', 'Random Forest', 'SVM'],
    projects: ['tinyml-af-detection', 'fall-detection-system'],
    note: 'Running models on the device instead of the cloud.',
  },
  {
    id: 'iot',
    label: 'IoT Connectivity',
    tech: ['Wi-Fi', 'MQTT', 'ThingsBoard', 'ThingSpeak'],
    projects: ['iot-sensor-builds', 'fall-detection-system'],
    note: 'Moving the right data, not all of it.',
  },
  {
    id: 'cloud',
    label: 'Cloud / DevOps',
    tech: ['Linux', 'Git/GitHub', 'Docker', 'FastAPI', 'CI/CD basics'],
    projects: ['wellnest'],
    note: 'Backends and tooling that keep devices useful.',
  },
  {
    id: 'apps',
    label: 'Real-World Applications',
    tech: ['Elderly care', 'Biomedical monitoring', 'Smart agriculture', 'Computer vision'],
    projects: ['wellnest', 'garden-watering-robot', 'face-mask-detection'],
    note: 'Where the system meets the people it is for.',
  },
];

export const focusAreas = [
  {
    id: 'embedded',
    title: 'Embedded Systems',
    items: ['ESP32', 'ESP32-S3', 'Arduino', 'NodeMCU / ESP8266', 'Microcontrollers', 'Sensors', 'Actuators', 'Firmware', 'RTOS', 'Hardware interfacing'],
  },
  {
    id: 'iot',
    title: 'IoT',
    items: ['MQTT', 'ThingsBoard', 'ThingSpeak', 'Sensor networks', 'Wireless communication', 'Cloud-connected devices', 'IoT architectures'],
  },
  {
    id: 'tinyml',
    title: 'TinyML / Edge AI',
    items: ['TinyML', 'TensorFlow Lite / TFLite Micro', 'Model optimization', 'INT8 quantization', 'On-device inference', 'Edge AI', 'Resource-constrained ML'],
  },
  {
    id: 'robotics',
    title: 'Robotics',
    items: ['Line-following robots', 'Sensor-based robotics', 'Motor control', 'Embedded robotics', 'Autonomous systems'],
  },
  {
    id: 'ai',
    title: 'AI / Machine Learning',
    items: ['Computer vision', 'Machine learning', 'Neural networks', 'NLP', 'AI agents'],
  },
  {
    id: 'cloud',
    title: 'Cloud & DevOps',
    items: ['Linux', 'Git/GitHub', 'Docker', 'Cloud fundamentals', 'CI/CD', 'DevOps', 'Backend systems'],
  },
  {
    id: 'hardware',
    title: 'Hardware & Engineering',
    items: ['Digital electronics', 'Sensors', 'PCB design', 'KiCad', 'EasyEDA', '3D printing', 'OpenSCAD', 'Hardware prototyping'],
  },
];

export const timeline = [
  { label: 'Computer Engineering', note: 'Started a BSc (Hons) in Computer Engineering at KDU, drawn by both electronics and software.' },
  { label: 'Embedded Systems', note: 'Microcontrollers, firmware and hardware interfacing became the core of most builds.' },
  { label: 'IoT', note: 'Connected sensor nodes, MQTT and cloud dashboards with ESP32 and ESP8266.' },
  { label: 'Robotics', note: 'Sensor-based robots and motor control, now a line-following garden watering robot.' },
  { label: 'AI/ML', note: 'Computer vision and classic ML, from mask detection to fall classification.' },
  { label: 'TinyML', note: 'Fitting models onto microcontrollers and measuring what that costs.' },
  { label: 'Edge AI', note: 'Designing systems that decide locally and send only what matters.' },
  { label: 'Research', note: 'Current study: INT8 quantization for ECG-based AF detection on ESP32-S3.', current: true },
];

export const skillTiers = [
  { id: 'comfortable', title: 'Comfortable with', note: 'Used regularly in builds and coursework.', items: ['Python', 'C/C++', 'Arduino', 'ESP32', 'Git/GitHub', 'Basic IoT development'] },
  { id: 'exploring', title: 'Currently exploring', note: 'Actively learning through current projects.', items: ['TinyML', 'Edge AI', 'TensorFlow Lite Micro', 'ESP32-S3', 'Model quantization', 'Robotics', 'DevOps'] },
  { id: 'research', title: 'Research interests', note: 'Questions I want to keep working on.', items: ['Embedded AI', 'Biomedical IoT', 'ECG analysis', 'Edge computing', 'Resource-constrained ML'] },
];

export const constellation: { id: string; label: string; group: 'domain' | 'lang' | 'hw' | 'tool'; links?: string[] }[] = [
  { id: 'tinyml', label: 'TinyML', group: 'domain', links: ['tensorflow', 'esp32', 'edgeai'] },
  { id: 'iot', label: 'IoT', group: 'domain', links: ['esp32', 'cloud'] },
  { id: 'embedded', label: 'Embedded', group: 'domain', links: ['cpp', 'esp32', 'arduino'] },
  { id: 'edgeai', label: 'Edge AI', group: 'domain', links: ['tensorflow'] },
  { id: 'robotics', label: 'Robotics', group: 'domain', links: ['arduino', 'cpp'] },
  { id: 'python', label: 'Python', group: 'lang', links: ['tensorflow'] },
  { id: 'cpp', label: 'C/C++', group: 'lang' },
  { id: 'esp32', label: 'ESP32', group: 'hw' },
  { id: 'arduino', label: 'Arduino', group: 'hw' },
  { id: 'tensorflow', label: 'TensorFlow', group: 'tool' },
  { id: 'linux', label: 'Linux', group: 'tool', links: ['devops'] },
  { id: 'git', label: 'Git', group: 'tool', links: ['devops'] },
  { id: 'cloud', label: 'Cloud', group: 'tool', links: ['devops'] },
  { id: 'devops', label: 'DevOps', group: 'tool' },
];

export const research = {
  interests: ['TinyML', 'Edge AI', 'Embedded Machine Learning', 'IoT', 'Biomedical Systems', 'ECG Signal Processing', 'Model Quantization', 'Resource-Constrained AI', 'Wearable Computing'],
  current: {
    title: 'Impact of INT8 Quantization on Compact ECG-Based AF Detection on ESP32-S3',
    status: 'In progress',
    question:
      'How does INT8 quantization affect AF detection performance, memory usage, and inference time of a compact ECG model on a microcontroller?',
    spec: [
      ['Research Area', 'TinyML + Embedded Systems + Biomedical IoT'],
      ['Hardware', 'ESP32-S3'],
      ['Signal', 'Single-lead ECG'],
      ['Target', 'Atrial Fibrillation Detection'],
      ['ML Model', 'Compact 1D CNN'],
      ['Optimization', 'INT8 Quantization'],
    ] as [string, string][],
    evaluation: ['Detection performance', 'Memory usage', 'Inference time', 'Model size', 'Computational requirements'],
    pipeline: ['ECG Dataset', 'Preprocessing', 'Model Training', 'Float32 Baseline', 'INT8 Quantization', 'ESP32-S3 Deployment', 'Performance Comparison'],
  },
};
