import re

with open('components/DownloadsPage.tsx', 'r') as f:
    content = f.read()

# Add activeCategory state
content = content.replace("const [searchTerm, setSearchTerm] = useState('');", "const [searchTerm, setSearchTerm] = useState('');\n    const [activeCategory, setActiveCategory] = useState<'ALL' | 'LESSON' | 'ANALYSIS'>('ALL');")

# Update filteredDownloads logic
old_filter = """    const filteredDownloads = downloads.filter(d =>
        d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );"""

new_filter = """    const filteredDownloads = downloads.filter(d => {
        const matchesSearch = d.title.toLowerCase().includes(searchTerm.toLowerCase()) || d.subject.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCat = activeCategory === 'ALL' || d.type === activeCategory;
        return matchesSearch && matchesCat;
    });"""
content = content.replace(old_filter, new_filter)

# Add category tabs UI right below the search bar
tabs_ui = """
                <div className="flex gap-2 mt-4 overflow-x-auto pb-1 scrollbar-hide">
                    <button
                        onClick={() => setActiveCategory('ALL')}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${activeCategory === 'ALL' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                        All Items
                    </button>
                    <button
                        onClick={() => setActiveCategory('LESSON')}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${activeCategory === 'LESSON' ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'}`}
                    >
                        Notes & MCQs
                    </button>
                    <button
                        onClick={() => setActiveCategory('ANALYSIS')}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${activeCategory === 'ANALYSIS' ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-600 hover:bg-rose-100'}`}
                    >
                        Test Analysis
                    </button>
                </div>"""

# Insert tabs after search bar in non-embedded mode
content = content.replace('className="w-full bg-slate-100 text-slate-700 text-sm rounded-xl py-3 pl-10 pr-4 outline-none border border-transparent focus:border-emerald-300 focus:bg-white transition-all font-medium placeholder:font-normal"\n                    />\n                </div>\n            </div>', f'className="w-full bg-slate-100 text-slate-700 text-sm rounded-xl py-3 pl-10 pr-4 outline-none border border-transparent focus:border-emerald-300 focus:bg-white transition-all font-medium placeholder:font-normal"\n                    />\n                </div>{tabs_ui}\n            </div>')

# Insert tabs after search bar in embedded mode
content = content.replace('className="w-full bg-white text-slate-700 text-sm rounded-xl py-3 pl-10 pr-4 outline-none border border-slate-200 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 transition-all font-medium placeholder:font-normal shadow-sm"\n                        />\n                    </div>\n                </div>', f'className="w-full bg-white text-slate-700 text-sm rounded-xl py-3 pl-10 pr-4 outline-none border border-slate-200 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 transition-all font-medium placeholder:font-normal shadow-sm"\n                        />\n                    </div>{tabs_ui}\n                </div>')


with open('components/DownloadsPage.tsx', 'w') as f:
    f.write(content)
