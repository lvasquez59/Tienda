import React, {FC, useEffect, useState} from 'react';
import {
  LayoutAnimation,
  NativeModules,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';
import {Text} from './Text';
import {Button, ButtonProps} from './Button';
import {ErrorMessage} from './ErrorMessage';

interface values {
  values: {[key: string]: any};
}

interface FormTypes {
  children?: (e: Arguments) => React.ReactNode | React.ReactNode;
  initialValues?: {[key: string]: any};
}

interface Arguments extends values {
  onchange: (e: any, name: string) => void;
  errors: {[key: string]: string};
}

export interface FormSubmit extends values {
  setErrors: React.Dispatch<any>;
  data: {[key: string]: any};
}

interface FormComponent extends FC<FormTypes> {
  submit: FC<submit>;
  required: FC<Required>;
}

export function validateFormData(formData: any, requiredFields: string[]) {
  const errors: {[key: string]: string} = {};
  requiredFields.forEach(field => {
    const isEmpty =
      formData[field] === '' ||
      formData[field] === false ||
      formData[field] === undefined;

    if (isEmpty) errors[field] = `El campo '${field}' es obligatorio`;
    else delete errors[field];
  });
  return errors;
}

const {UIManager} = NativeModules;
UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

/**
 * Componente funcional que valida un formulario.
 */

export const Form: FormComponent = ({children, initialValues}) => {
  const [values, setValues] = useState(initialValues ?? {});
  const [ChilGlobal, setChilGlobal] = useState<React.ReactNode>();
  const [errors, setErrors] = useState<{[key: string]: any}>({});
  let data: {[key: string]: any} = {};
  const [load, setLoad] = useState(false);

  LayoutAnimation.easeInEaseOut();

  useEffect(
    () =>
      setChilGlobal(
        typeof children == 'function'
          ? children({onchange, values, errors})
          : children,
      ),
    [children, values, errors, load],
  );

  useEffect(() => setValues(initialValues ?? {}), [initialValues]);

  const onchange = (e: any, name: string): void => {
    if (errors[name]) delete errors[name];
    setValues({...values, [name]: e});
  };

  const component: any = (children: any) => {
    return React.Children.map(children ?? [], child => {
      if (!child || typeof child !== 'object') return child;

      if ('isRequired' in child.props || child.type === Form.required)
        data[child.props.name] = child.props.value;

      if (child.type == Form.submit)
        return (
          <Form.submit
            {...child.props}
            load={load}
            onPress={async e => {
              setLoad(true);
              child.props.onPress && child.props.onPress(e);
              const err = validateFormData(data, Object.keys(data));
              if (Object.keys(err).length == 0 && child.props.onSubmit && !load)
                await child.props.onSubmit({values, setErrors, data});
              else setErrors(err);
              setLoad(false);
            }}
          />
        );
      if ('children' in child.props)
        return React.cloneElement(child, {
          ...child.props,
          children: component(child.props.children),
        });

      return child;
    });
  };
  return component(ChilGlobal);
};

interface submit extends ButtonProps {
  onSubmit?: (e: FormSubmit) => void;
}
/**
 * Componente funcional que representa el botón de envío del formulario.
 */
Form.submit = (props: ButtonProps) => <Button {...props} />;

interface Required {
  /**
   * Elementos hijos del componente `Form.required`.
   */
  children?: React.ReactElement | React.ReactElement[];

  /**
   * Objeto de errores.
   */
  errors?: string | any;

  /**
   * Nombre del campo.
   */
  name: string;

  /**
   * Valor del campo.
   */
  value?: string;

  /**
   * Etiqueta del campo.
   */
  label?: string;

  /**
   * Estilo adicional para el contenedor del campo.
   */
  containerStyle?: StyleProp<ViewStyle>;
}
/**
 * Componente funcional que representa un campo obligatorio en el formulario.
 */
Form.required = ({
  children,
  errors,
  name,
  value,
  label,
  containerStyle,
}: Required) => {
  return (
    <View style={containerStyle}>
      {label && (
        <Text style={{marginVertical: 2}}>
          {label}
          <Text style={{color: 'red'}}> *</Text>
        </Text>
      )}
      {children}
      {name && ErrorMessage(errors, name, label)}
    </View>
  );
};
