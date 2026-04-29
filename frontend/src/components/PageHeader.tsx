import { ReactNode } from "react";

interface PageHeaderProps { title: string; description?: string; actions?: ReactNode; }

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b px-6 py-4">
      <div>
        <h1 className="text-black">
          Hello
        </h1>
        <h1 className="text-xl font-semibold">{title}</h1>
        {description && <p className="text-sm text-muted-foreground mt-0.5">{description}</p>}
      </div>
      {actions && <div>{actions}</div>}
    </div>
  );
}
