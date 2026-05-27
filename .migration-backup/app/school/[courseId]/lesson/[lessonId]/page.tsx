import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lesson',
  description: 'Watch a Bible school lesson.',
};

interface LessonPageProps {
  params: { courseId: string; lessonId: string };
}

/** Protected route — middleware redirects unauthenticated users to /login. */
export default function LessonPage({ params }: LessonPageProps) {
  return (
    <section className="container mx-auto px-6 pt-28 pb-16">
      <h1 className="font-cinzel text-4xl text-white">Lesson</h1>
      <p className="mt-3 text-gray-400">
        Course {params.courseId} · Lesson {params.lessonId}
      </p>
    </section>
  );
}
