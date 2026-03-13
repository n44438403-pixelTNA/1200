import re

with open('components/BoostScoreHub.tsx', 'r') as f:
    content = f.read()

content = content.replace("topicMap[session.topic] = {", "topicMap[topic] = {")

with open('components/BoostScoreHub.tsx', 'w') as f:
    f.write(content)
