'use client';

import Link from 'next/link';
import type { ComponentProps, MouseEvent } from 'react';
import { useTransitionRouter } from './Providers';

type Props = ComponentProps<typeof Link> & { href: string };

/** A Next.js Link that fades the page out before navigating (opacity only). */
export function TransitionLink({ href, onClick, children, ...rest }: Props) {
  const { navigate } = useTransitionRouter();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    if (rest.target && rest.target !== '_self') return;
    event.preventDefault();
    navigate(href);
  };

  return (
    <Link href={href} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
}
