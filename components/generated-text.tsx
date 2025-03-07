'use client';

interface GeneratedTextProps {
  text: string;
}

export function GeneratedText({ text }: GeneratedTextProps) {
  // Split the text into sections
  const sections = text.split('\n\n');

  return (
    <div className="space-y-6 text-left">
      {sections.map((section, index) => {
        if (section.startsWith('🔥')) {
          // Headline
          return (
            <h1 key={index} className="text-2xl font-bold text-center tracking-tight">
              {section}
            </h1>
          );
        } else if (index === 1) {
          // Subheadline
          return (
            <h2 key={index} className="text-xl font-semibold text-center text-muted-foreground">
              {section}
            </h2>
          );
        } else if (section.startsWith('•')) {
          // Bullet points
          return (
            <ul key={index} className="list-none space-y-2 pl-4">
              {section.split('\n').map((bullet, i) => (
                <li key={i} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{bullet.replace('• ', '')}</span>
                </li>
              ))}
            </ul>
          );
        } else if (section.startsWith('"')) {
          // Testimonial
          return (
            <blockquote key={index} className="border-l-4 border-primary pl-4 italic">
              {section}
            </blockquote>
          );
        } else if (section.includes('>>')) {
          // Call to action
          return (
            <div key={index} className="text-center font-bold text-primary text-lg">
              {section}
            </div>
          );
        } else {
          // Regular paragraphs
          return (
            <p key={index} className="text-base leading-relaxed">
              {section}
            </p>
          );
        }
      })}
    </div>
  );
} 