import { TaskProvider } from "@/context/TaskContext";

export function withTaskProvider(Component: any) {
  return function WrappedComponent(props: any) {
    return (
      <TaskProvider>
        <Component {...props} />
      </TaskProvider>
    );
  };
}
