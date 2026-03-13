import re

with open('components/McqView.tsx', 'r') as f:
    mcq_content = f.read()

mcq_content = mcq_content.replace("import { CheckCircle, Lock, ArrowLeft, Crown, PlayCircle, HelpCircle, Trophy, Clock, BrainCircuit, FileText } from 'lucide-react';", "import { CheckCircle, Lock, ArrowLeft, Crown, PlayCircle, HelpCircle, Trophy, Clock, BrainCircuit, FileText, HardDriveDownload } from 'lucide-react';\nimport { downloadManager } from '../utils/downloadManager';")

with open('components/McqView.tsx', 'w') as f:
    f.write(mcq_content)
