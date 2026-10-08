import { Link } from 'react-router-dom';
import { usePageMeta } from '../hooks/hooks';
import { Container, btn } from '../components/ui/ui';

export default function NotFound() {
  usePageMeta('Not found');
  return (
    <Container className="flex flex-col items-start gap-5 py-28">
      <p className="font-mono text-sm text-accent">sadeep@engineering-lab:~$ cd {window.location.pathname}</p>
      <p className="font-mono text-sm text-muted">bash: no such file or directory</p>
      <h1 className="display-wide text-5xl text-fg">404</h1>
      <p className="text-muted">This page doesn't exist, or it moved.</p>
      <Link to="/" className={btn.primary}>
        Back to the lab
      </Link>
    </Container>
  );
}
