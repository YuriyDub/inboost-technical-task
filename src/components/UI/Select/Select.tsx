import { useEffect, useRef, useState } from 'react';
import styles from './Select.module.scss';

export type SelectPropsType = {
  onChange?: (option: string) => void;
  value?: string;
  renderValue?: (value: string) => React.ReactNode;
  options?: { label: string; value: string }[];
  placeholder?: string;
  className?: string;
};

const defaultRenderValue = (value: string) => <span>{value}</span>;

export const Select = ({
  onChange,
  value,
  renderValue = defaultRenderValue,
  options,
  placeholder,
  className,
}: SelectPropsType) => {
  const [active, setActive] = useState(false);

  const selectRootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeOptionsOutside = (event: MouseEvent) => {
      if (selectRootRef.current && !selectRootRef.current.contains(event.target as Node)) {
        setActive(false);
      }
    };

    if (active) {
      document.addEventListener('click', closeOptionsOutside);
    }

    return () => {
      document.removeEventListener('click', closeOptionsOutside);
    };
  }, [active]);

  const chooseOption = (option: string) => {
    onChange?.(option);
    setActive(false);
  };

  return (
    <div
      className={`${styles.select} ${styles[active ? 'active' : '']} ${className}`}
      ref={selectRootRef}>
      <button
        className={styles.selectBody}
        onClick={() => {
          setActive((prev) => !prev);
        }}>
        <div className={styles.selectedOption}>
          {value ? renderValue(value) : <span className={styles.placeholder}>{placeholder}</span>}
        </div>
        {active ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6">
            <path
              fillRule="evenodd"
              d="M11.47 7.72a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06L12 9.31l-6.97 6.97a.75.75 0 0 1-1.06-1.06l7.5-7.5Z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6">
            <path
              fillRule="evenodd"
              d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </button>
      <div className={styles.pivot}>
        <ul className={`${styles.options} ${styles.active}`}>
          {options?.map((o) => (
            <li
              className={styles.option}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                chooseOption(o.value);
              }}
              key={o.label}>
              {o.value === value ? (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <rect width="16" height="16" rx="2" fill="#95BEFC" />
                  <path
                    d="M12 5L6.5 10.5L4 8"
                    stroke="white"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              ) : (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <rect
                    x="0.5"
                    y="0.5"
                    width="15"
                    height="15"
                    rx="1.5"
                    fill="white"
                    stroke="#95BEFC"
                  />
                </svg>
              )}
              {o.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
