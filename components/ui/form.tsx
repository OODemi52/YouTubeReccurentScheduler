import * as React from "react";
import {
  Controller,
  ControllerProps,
  FormProvider,
  useFormContext,
  FieldValues,
  FieldPath,
} from "react-hook-form";
import { useLabel } from "@react-aria/label";

import { cn } from "@/lib/utils";

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue,
);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const { getFieldState, formState } = useFormContext();
  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  return {
    ...fieldState,
    name: fieldContext.name,
  };
};

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("space-y-2", className)} {...props} />;
});

FormItem.displayName = "FormItem";

const FormLabel = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => {
  let { labelProps } = useLabel(props);

  return (
    <label ref={ref} {...labelProps} className={cn("text-sm", className)}>
      {props.children}
    </label>
  );
});

FormLabel.displayName = "FormLabel";

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
});

FormDescription.displayName = "FormDescription";

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error } = useFormField();
  const message = error ? String(error?.message) : children;

  if (!message) return null;

  return (
    <p
      ref={ref}
      className={cn("text-sm font-medium text-red-500", className)}
      {...props}
    >
      {message}
    </p>
  );
});

FormMessage.displayName = "FormMessage";

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
  FormField,
};
