import re

with open('components/HistoryPage.tsx', 'r') as f:
    content = f.read()

# Fix ReferenceError: HardDriveDownload is not defined
if 'import { HardDriveDownload }' not in content and 'HardDriveDownload,' not in content:
    content = content.replace("import { FileText, Folder, CheckCircle2, AlertCircle, X, ChevronRight, Lock, Calendar, BookOpen, Clock, Download, ChevronDown, Award } from 'lucide-react';", "import { FileText, Folder, CheckCircle2, AlertCircle, X, ChevronRight, Lock, Calendar, BookOpen, Clock, Download, ChevronDown, Award, HardDriveDownload } from 'lucide-react';")
    content = content.replace("import { FileText, Folder, CheckCircle2, AlertCircle, X, ChevronRight, Lock, Calendar, BookOpen, Clock, Download, ChevronDown, Award, HardDriveDownload } from 'lucide-react';", "import { FileText, Folder, CheckCircle2, AlertCircle, X, ChevronRight, Lock, Calendar, BookOpen, Clock, Download, ChevronDown, Award, HardDriveDownload } from 'lucide-react';") # Duplicate safeguard just in case

# Try another common pattern if the first one didn't match
if 'HardDriveDownload' not in content.split('from \'lucide-react\'')[0]:
    content = re.sub(r"import\s+\{(.*?)\}\s+from\s+'lucide-react';", lambda m: f"import {{{m.group(1)}{', HardDriveDownload' if 'HardDriveDownload' not in m.group(1) else ''}}} from 'lucide-react';", content)

# Ensure title is fully "Downloads & Activity Log"
content = content.replace('Downloads & Activity', 'Downloads & Activity Log')

with open('components/HistoryPage.tsx', 'w') as f:
    f.write(content)
