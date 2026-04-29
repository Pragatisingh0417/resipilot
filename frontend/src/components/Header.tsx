interface HeaderProps { title: string; description?: string; }

export default function Header({ title, description }: HeaderProps) {
  return (
    <div className="border-b px-6 py-4">
      <h1 className="text-xl font-semibold">{title}</h1>
      {description && <p className="text-sm text-muted-foreground mt-0.5">{description}</p>}
    </div>
  );
}
