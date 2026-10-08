export type ProjectCategory = 'Research' | 'IoT / Embedded Systems' | 'AI / ML' | 'Robotics';
export type ProjectVisual = 'ecg' | 'imu' | 'agents' | 'robot' | 'vision' | 'iot';

export interface Project {
  slug: string;
  title: string;
  /** One-line, card-sized summary. */
  summary: string;
  category: ProjectCategory;
  status: string;
  tech: string[];
  visual: ProjectVisual;
  featured?: boolean;
  /** Only real URLs. Leave undefined and the button is hidden. */
  links: { github?: string; demo?: string };
  caseStudy: {
    overview: string;
    role?: string;
    question?: string;
    /** Ordered system architecture: each item is one stage. */
    architecture: { label: string; detail: string }[];
    components?: string[];
    focus: string[];
    next: string[];
  };
}

export const projects: Project[] = [
  {
    slug: 'tinyml-af-detection',
    title: 'TinyML AF Detection on ESP32-S3',
    summary:
      'On-device detection of atrial fibrillation from single-lead ECG, studying what INT8 quantization changes on a microcontroller.',
    category: 'Research',
    status: 'Ongoing research',
    tech: ['ESP32-S3', 'AD8232', 'Single-lead ECG', '1D CNN', 'TensorFlow Lite Micro', 'INT8 quantization', 'Edge AI'],
    visual: 'ecg',
    featured: true,
    links: {},
    caseStudy: {
      overview:
        'A research-oriented embedded AI project: TinyML-based on-device detection of atrial fibrillation (AF) from single-lead ECG using an ESP32-S3. The work compares a Float32 baseline against an INT8-quantized version of the same compact model, measured on the device itself.',
      question:
        'How does INT8 quantization affect AF detection performance, memory usage, and inference time of a compact ECG model on a microcontroller?',
      architecture: [
        { label: 'ECG dataset', detail: 'Labelled single-lead ECG recordings for AF and normal rhythm.' },
        { label: 'Preprocessing', detail: 'Filtering, segmentation into fixed windows, normalisation.' },
        { label: 'Model training', detail: 'A compact 1D CNN sized for microcontroller memory.' },
        { label: 'Float32 baseline', detail: 'Reference accuracy and footprint before optimisation.' },
        { label: 'INT8 quantization', detail: 'Post-training quantization to 8-bit integer weights and activations.' },
        { label: 'ESP32-S3 deployment', detail: 'Model compiled into firmware with TensorFlow Lite Micro.' },
        { label: 'Comparison', detail: 'Detection performance, memory, latency and model size side by side.' },
      ],
      components: ['ESP32-S3 development board', 'AD8232 single-lead ECG front end', 'Electrodes'],
      focus: ['Detection performance', 'Memory usage (flash and RAM)', 'Inference time', 'Model size', 'Computational requirements'],
      next: ['Finalise preprocessing pipeline', 'Train and freeze the Float32 baseline', 'Quantize, deploy and measure on device', 'Publish results here once experiments are complete'],
    },
  },
  {
    slug: 'fall-detection-system',
    title: 'IoT Fall Detection System',
    summary:
      'A wearable-style ESP32 + MPU6050 node that classifies falls with embedded ML and checks for post-fall inactivity, with a custom PCB and enclosure.',
    category: 'IoT / Embedded Systems',
    status: 'In development',
    tech: ['ESP32', 'MPU6050 IMU', 'Random Forest', 'SVM', 'KiCad', 'OpenSCAD', '3D printing', 'IoT'],
    visual: 'imu',
    featured: true,
    links: {},
    caseStudy: {
      overview:
        'An IoT-based fall detection system aimed at elderly care. An ESP32 reads motion data from an MPU6050 IMU, a classifier separates falls from everyday movement, and a post-fall inactivity check is used to confirm an event before an alert goes out. The hardware side includes a PCB designed in KiCad and a parametric 3D-printed enclosure written in OpenSCAD.',
      architecture: [
        { label: 'MPU6050 IMU', detail: '3-axis accelerometer and gyroscope sampled by the ESP32.' },
        { label: 'Feature window', detail: 'Motion features computed over short sliding windows.' },
        { label: 'Embedded ML', detail: 'Random Forest and SVM classifiers compared for fall vs. activity.' },
        { label: 'Inactivity check', detail: 'Post-fall analysis to cut false alarms from sudden but harmless movement.' },
        { label: 'IoT alert', detail: 'Event pushed over Wi-Fi to a caregiver-facing service.' },
      ],
      components: ['ESP32', 'MPU6050', 'Custom PCB (KiCad)', 'Parametric enclosure, ~120 × 65 × 35 mm (OpenSCAD)'],
      focus: ['False alarm reduction', 'Post-fall verification', 'Modular, maintainable hardware design', 'Design for reliability and safety'],
      next: ['Collect and label a larger motion dataset', 'Field-test the enclosure and PCB revision', 'Document classifier comparison'],
    },
  },
  {
    slug: 'wellnest',
    title: 'WellNest',
    summary:
      'A privacy-first Ambient Assisted Living multi-agent system for elderly care — camera-free sensing with cooperating AI agents.',
    category: 'AI / ML',
    status: 'Prototype',
    tech: ['Multi-agent AI', 'FastAPI', 'Google ADK', 'Gemini', 'A2A Protocol', 'MCP', 'HL7 FHIR R4', 'ESP32-S3'],
    visual: 'agents',
    featured: true,
    links: {},
    caseStudy: {
      overview:
        'WellNest: A Privacy-First Ambient Assisted Living Multi-Agent System. It monitors wellbeing at home without cameras, using ambient sensing and four cooperating agents that share events over an asynchronous publish/subscribe bus. Built as a team prototype for AI Challenge Sri Lanka 2026 (Phase II).',
      role: 'Backend Design + UI/UX',
      architecture: [
        { label: 'Ambient sensing', detail: 'Camera-free presence sensing, including an ESP32-S3 RF/Wi-Fi presence node.' },
        { label: 'Sensory Guardian', detail: 'Agent that watches sensor events for unusual patterns.' },
        { label: 'Medical Compliance', detail: 'Agent that tracks medication schedules and interaction checks.' },
        { label: 'Cognitive Companion', detail: 'Agent for conversational check-ins and routine support.' },
        { label: 'Care Coordinator', detail: 'Agent that decides who to notify and how.' },
        { label: 'Portals', detail: 'Interfaces for the command centre, family and clinicians.' },
      ],
      focus: ['Privacy-first design', 'Ambient Assisted Living', 'Multi-agent orchestration', 'Elderly care', 'Backend architecture', 'UI/UX', 'Intelligent monitoring'],
      next: ['Harden the event bus and agent contracts', 'Usability testing of the family-facing app'],
    },
  },
  {
    slug: 'garden-watering-robot',
    title: 'Garden Watering Robot',
    summary:
      'A line-following robot that visits garden zones, reads soil moisture, and waters only where it is needed.',
    category: 'Robotics',
    status: 'In progress',
    tech: ['ESP32-S3', 'Line following', 'IR sensors', 'Motor driver', 'DC motors', 'Soil moisture sensors', 'Water pump'],
    visual: 'robot',
    featured: true,
    links: {},
    caseStudy: {
      overview:
        'The garden is split into two zones, each with soil moisture sensors. The robot follows a line to each zone, checks how dry the soil is, and waters when needed. ESP32-S3 boards handle both the robot and the zone sensing.',
      architecture: [
        { label: 'Zone sensors', detail: 'Soil moisture readings from each of the two garden zones.' },
        { label: 'Decision', detail: 'Choose which zone needs water next.' },
        { label: 'Line following', detail: 'IR sensor array and motor driver keep the robot on the track.' },
        { label: 'Stop at zone', detail: 'Robot detects the zone marker and stops.' },
        { label: 'Watering', detail: 'Pump runs until the zone is watered.' },
      ],
      components: ['ESP32-S3 boards', 'IR line sensors', 'Motor driver + DC motors', 'Soil moisture sensors', 'Water pump + relay'],
      focus: ['Embedded control loop', 'Sensor-based navigation', 'Reliable zone stopping', 'Power and water handling'],
      next: ['Tune line-following control', 'Add zone-to-robot communication', 'Weatherproof the electronics'],
    },
  },
  {
    slug: 'face-mask-detection',
    title: 'Face Mask Detection',
    summary:
      'A computer vision pipeline that finds faces in a camera feed and classifies mask / no mask with a MobileNetV2 CNN, served through Flask.',
    category: 'AI / ML',
    status: 'Built',
    tech: ['Python', 'OpenCV', 'MobileNetV2', 'Flask', 'Machine Learning', 'Computer Vision'],
    visual: 'vision',
    links: {},
    caseStudy: {
      overview:
        'A real-time computer vision project. Frames from a camera are scanned for faces with OpenCV, each face is preprocessed and passed to a MobileNetV2-based classifier, and the result is drawn back onto the video in a small Flask web app.',
      architecture: [
        { label: 'Camera', detail: 'Live video frames captured with OpenCV.' },
        { label: 'Face detection', detail: 'Faces located in each frame.' },
        { label: 'Preprocessing', detail: 'Crop, resize and normalise each face.' },
        { label: 'CNN', detail: 'MobileNetV2 transfer-learned classifier.' },
        { label: 'Mask / No mask', detail: 'Label and box drawn on the stream in the Flask app.' },
      ],
      focus: ['Transfer learning with a lightweight backbone', 'Real-time inference loop', 'Simple web delivery with Flask'],
      next: ['Explore running a quantized version at the edge'],
    },
  },
  {
    slug: 'iot-sensor-builds',
    title: 'IoT & Sensor Builds',
    summary:
      'A running collection of hands-on ESP32, ESP8266 and Arduino builds — sensing, actuation and cloud dashboards over MQTT.',
    category: 'IoT / Embedded Systems',
    status: 'Ongoing collection',
    tech: ['ESP32', 'ESP8266', 'Arduino', 'DHT sensors', 'MQ gas sensors', 'Ultrasonic', 'Servo', 'Relays', 'MQTT', 'ThingsBoard', 'ThingSpeak'],
    visual: 'iot',
    links: {},
    caseStudy: {
      overview:
        'Practical embedded and IoT work: reading environmental and distance sensors, driving actuators like servos, relays and water pumps, and publishing data to cloud dashboards.',
      architecture: [
        { label: 'Sensors', detail: 'DHT temperature/humidity, MQ gas, ultrasonic distance.' },
        { label: 'Microcontroller', detail: 'ESP32, ESP8266 / NodeMCU or Arduino.' },
        { label: 'Actuators', detail: 'LEDs, servo motors, relays and water pumps.' },
        { label: 'Connectivity', detail: 'Wi-Fi and MQTT messaging.' },
        { label: 'Dashboards', detail: 'ThingsBoard and ThingSpeak for live data and control.' },
      ],
      focus: ['Hardware interfacing', 'Firmware structure', 'MQTT topic design', 'Cloud dashboards'],
      next: ['Write up individual builds as Engineering Notes'],
    },
  },
];

export const projectCategories: ('All' | ProjectCategory)[] = ['All', 'Research', 'IoT / Embedded Systems', 'AI / ML', 'Robotics'];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
