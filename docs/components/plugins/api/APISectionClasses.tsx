import ReactMarkdown from 'react-markdown';

import {
  ClassDefinitionData,
  GeneratedData,
  PropData,
} from '~/components/plugins/api/APIDataTypes';
import { APISectionDeprecationNote } from '~/components/plugins/api/APISectionDeprecationNote';
import { renderMethod } from '~/components/plugins/api/APISectionMethods';
import { renderProp } from '~/components/plugins/api/APISectionProps';
import {
  CommentTextBlock,
  getAPISectionHeader,
  H3Code,
  getTagData,
  getTagNamesList,
  mdComponents,
  resolveTypeName,
  STYLES_APIBOX,
  STYLES_APIBOX_NESTED,
  STYLES_NESTED_SECTION_HEADER,
  TypeDocKind,
} from '~/components/plugins/api/APISectionUtils';
import { H2, H4, BOLD, P, CODE } from '~/ui/components/Text';

export type APISectionClassesProps = {
  data: GeneratedData[];
};

const classNamesMap: Record<string, string> = {
  AccelerometerSensor: 'Accelerometer',
  BarometerSensor: 'Barometer',
  DeviceMotionSensor: 'DeviceMotion',
  GyroscopeSensor: 'Gyroscope',
  MagnetometerSensor: 'Magnetometer',
} as const;

const isProp = (child: PropData) =>
  child.kind === TypeDocKind.Property &&
  !child.overwrites &&
  !child.name.startsWith('_') &&
  !child.implementationOf;

const isMethod = (child: PropData, allowOverwrites: boolean = false) =>
  child.kind &&
  [TypeDocKind.Method, TypeDocKind.Function, TypeDocKind.Accessor].includes(child.kind) &&
  (allowOverwrites || !child.overwrites) &&
  !child.name.startsWith('_') &&
  !child?.implementationOf;

const remapClass = (clx: ClassDefinitionData) => {
  clx.isSensor = clx.name.endsWith('Sensor');
  clx.name = classNamesMap[clx.name] ?? clx.name;

  if (clx.isSensor && clx.extendedTypes) {
    clx.extendedTypes = clx.extendedTypes.map(type => ({
      ...type,
      name: type.name === 'default' ? 'DeviceSensor' : type.name,
    }));
  }

  return clx;
};

const renderClass = (clx: ClassDefinitionData, exposeInSidebar: boolean): JSX.Element => {
  const { name, comment, type, extendedTypes, children, implementedTypes, isSensor } = clx;
  const Header = getAPISectionHeader(exposeInSidebar);

  const properties = children?.filter(isProp);
  const methods = children
    ?.filter(child => isMethod(child, isSensor))
    .sort((a: PropData, b: PropData) => a.name.localeCompare(b.name));
  const returnComment = getTagData('returns', comment);

  return (
    <div key={`class-definition-${name}`} css={[STYLES_APIBOX, STYLES_APIBOX_NESTED]}>
      <APISectionDeprecationNote comment={comment} />
      <H3Code tags={getTagNamesList(comment)}>
        <CODE>{name}</CODE>
      </H3Code>
      {(extendedTypes?.length || implementedTypes?.length) && (
        <P>
          <BOLD>Type: </BOLD>
          {type ? <CODE>{resolveTypeName(type)}</CODE> : 'Class'}
          {extendedTypes?.length && (
            <>
              <span> extends </span>
              {extendedTypes.map(extendedType => (
                <CODE key={`extends-${extendedType.name}`}>{resolveTypeName(extendedType)}</CODE>
              ))}
            </>
          )}
          {implementedTypes?.length && (
            <>
              <span> implements </span>
              {implementedTypes.map(implementedType => (
                <CODE key={`implements-${implementedType.name}`}>
                  {resolveTypeName(implementedType)}
                </CODE>
              ))}
            </>
          )}
        </P>
      )}
      <CommentTextBlock comment={comment} />
      {returnComment && (
        <>
          <div css={STYLES_NESTED_SECTION_HEADER}>
            <H4>Returns</H4>
          </div>
          <ReactMarkdown components={mdComponents}>{returnComment.text}</ReactMarkdown>
        </>
      )}
      {properties?.length ? (
        <>
          <div css={STYLES_NESTED_SECTION_HEADER}>
            <Header>{name} Properties</Header>
          </div>
          <div>
            {properties.map(property =>
              renderProp(property, property?.defaultValue, exposeInSidebar)
            )}
          </div>
        </>
      ) : null}
      {methods?.length && (
        <>
          <div css={STYLES_NESTED_SECTION_HEADER}>
            <Header>{name} Methods</Header>
          </div>
          {methods.map(method => renderMethod(method, { exposeInSidebar }))}
        </>
      )}
    </div>
  );
};

const APISectionClasses = ({ data }: APISectionClassesProps) => {
  if (data?.length) {
    const exposeInSidebar = data.length < 2;
    return (
      <>
        <H2>Classes</H2>
        {data.map(clx => renderClass(remapClass(clx), exposeInSidebar))}
      </>
    );
  }
  return null;
};

export default APISectionClasses;
