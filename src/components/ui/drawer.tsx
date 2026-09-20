import * as React from 'react';
import { Drawer as DrawerPrimitive } from 'vaul';
import { cn } from '@/lib/utils';

function Drawer({
  shouldScaleBackground = false,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) {
  return (
    <DrawerPrimitive.Root
      shouldScaleBackground={shouldScaleBackground}
      {...props}
    />
  );
}
Drawer.displayName = 'Drawer';

const DrawerTrigger = DrawerPrimitive.Trigger;
const DrawerPortal = DrawerPrimitive.Portal;
const DrawerClose = DrawerPrimitive.Close;

function DrawerOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Overlay>) {
  return (
    <DrawerPrimitive.Overlay
      className={cn('fixed inset-0 z-40 bg-black/40 backdrop-blur-xs', className)}
      {...props}
    />
  );
}
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName;

function DrawerContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Content>) {
  return (
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerPrimitive.Content
        className={cn(
          'fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[28px] border border-slate-200/90 bg-white/98 backdrop-blur-2xl shadow-2xl focus:outline-none',
          className
        )}
        {...props}
      >
        <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-slate-300" />
        {children}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  );
}
DrawerContent.displayName = 'DrawerContent';

function DrawerHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('grid gap-1.5 p-4 text-center sm:text-left', className)}
      {...props}
    />
  );
}
DrawerHeader.displayName = 'DrawerHeader';

function DrawerFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('mt-auto flex flex-col gap-2 p-4', className)}
      {...props}
    />
  );
}
DrawerFooter.displayName = 'DrawerFooter';

function DrawerTitle({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Title>) {
  return (
    <DrawerPrimitive.Title
      className={cn(
        'text-lg font-bold leading-none tracking-tight text-slate-900',
        className
      )}
      {...props}
    />
  );
}
DrawerTitle.displayName = DrawerPrimitive.Title.displayName;

function DrawerDescription({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Description>) {
  return (
    <DrawerPrimitive.Description
      className={cn('text-xs text-slate-500', className)}
      {...props}
    />
  );
}
DrawerDescription.displayName = DrawerPrimitive.Description.displayName;

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
