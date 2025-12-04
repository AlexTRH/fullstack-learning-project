// Пример страницы с ISR (Incremental Static Regeneration)
// Эта страница будет регенерироваться каждые 60 секунд

export const revalidate = 60; // Регенерация каждые 60 секунд

async function getData() {
  // В реальном проекте здесь будет запрос к API
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/data`,
    { next: { revalidate: 60 } } // ISR настройка
  );
  
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  
  return res.json();
}

export default async function ISRPage() {
  const data = await getData();

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">ISR Example Page</h1>
      <p className="text-muted-foreground mb-4">
        Эта страница регенерируется каждые 60 секунд
      </p>
      <div className="bg-card p-4 rounded-lg">
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  );
}


