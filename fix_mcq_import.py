import re

with open('components/McqView.tsx', 'r') as f:
    mcq_content = f.read()

# Add imports correctly
if 'import { downloadManager }' not in mcq_content:
    mcq_content = mcq_content.replace("import { db, saveUserToLive } from '../firebase';", "import { db, saveUserToLive } from '../firebase';\nimport { downloadManager } from '../utils/downloadManager';\nimport { HardDriveDownload } from 'lucide-react';")

# Add the icon to existing lucide import if not present
if 'HardDriveDownload' not in mcq_content.split("from 'lucide-react'")[0]:
    mcq_content = mcq_content.replace("import { Crown, HelpCircle, CheckCircle, XCircle, ArrowLeft, ArrowRight, Play, AlertCircle, RotateCcw, Clock, Trophy, ChevronRight, AlertTriangle, FastForward, PlayCircle } from 'lucide-react';", "import { Crown, HelpCircle, CheckCircle, XCircle, ArrowLeft, ArrowRight, Play, AlertCircle, RotateCcw, Clock, Trophy, ChevronRight, AlertTriangle, FastForward, PlayCircle, HardDriveDownload } from 'lucide-react';")

with open('components/McqView.tsx', 'w') as f:
    f.write(mcq_content)
