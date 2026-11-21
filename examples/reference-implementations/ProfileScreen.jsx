import React, { useEffect, useId, useRef, useState } from 'react';
import InteractiveSheet from './InteractiveSheet.jsx';
import './tokens.css';
import './profile-screen.css';

function tick() {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate(10);
  }
}

function Section({ title, children }) {
  const id = useId();
  return (
    <section className="profile-screen__section" aria-labelledby={id}>
      <h2 id={id} className="profile-screen__section-title">{title}</h2>
      <div className="profile-screen__group">{children}</div>
    </section>
  );
}

function Row({ title, value, action }) {
  return (
    <div className="profile-row">
      <div>
        <span className="profile-row__title">{title}</span>
        <span className="profile-row__value">{value}</span>
      </div>
      {action}
    </div>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <button
      type="button"
      className="profile-toggle"
      role="switch"
      aria-checked={checked}
      aria-label={`${label}, ${checked ? 'on' : 'off'}`}
      onClick={() => {
        onChange(!checked);
        tick();
      }}
    >
      <span className="profile-toggle__track" aria-hidden="true" />
      <span className="profile-toggle__knob" aria-hidden="true" />
    </button>
  );
}

export default function ProfileScreen() {
  const [displayName, setDisplayName] = useState('Nathan');
  const [draftName, setDraftName] = useState(displayName);
  const [twoFactor, setTwoFactor] = useState(true);
  const [editing, setEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [status, setStatus] = useState('Saved');
  const [error, setError] = useState('');
  const editButtonRef = useRef(null);
  const inputRef = useRef(null);
  const inputId = useId();

  useEffect(() => {
    if (editing && inputRef.current) inputRef.current.focus();
  }, [editing]);

  function openEditor() {
    setDraftName(displayName);
    setError('');
    setEditing(true);
  }

  function closeEditor() {
    setEditing(false);
    editButtonRef.current?.focus();
  }

  function shakeInput() {
    const el = inputRef.current;
    if (!el) return;
    el.classList.remove('is-shaking');
    void el.offsetWidth;
    el.classList.add('is-shaking');
  }

  function saveName() {
    const value = draftName.trim();
    if (!value) {
      setError('Enter a display name.');
      shakeInput();
      return;
    }
    setDisplayName(value);
    setStatus('Saved');
    tick();
    closeEditor();
  }

  function confirmDelete() {
    setConfirmingDelete(false);
    setStatus('Delete action not available in this reference build');
  }

  return (
    <main className="profile-screen">
      <div className="profile-screen__inner">
        <header>
          <h1 className="profile-screen__title">Profile</h1>
          <p className="profile-screen__intro">
            Manage how your account appears and how you sign in.
          </p>
        </header>

        <Section title="Account">
          <Row
            title="Display Name"
            value={displayName}
            action={
              <button
                ref={editButtonRef}
                type="button"
                className="profile-button"
                onClick={openEditor}
              >
                Edit
              </button>
            }
          />
          <Row
            title="Two-Factor Authentication"
            value="Adds a second step when signing in."
            action={
              <Toggle
                label="Two-Factor Authentication"
                checked={twoFactor}
                onChange={setTwoFactor}
              />
            }
          />
        </Section>

        <Section title="Session">
          <Row title="Save Status" value={status} action={null} />
        </Section>

        <Section title="Danger Zone">
          <button
            type="button"
            className="profile-button profile-button--destructive"
            onClick={() => setConfirmingDelete(true)}
          >
            Delete Account
          </button>
        </Section>

        {confirmingDelete && (
          <div className="profile-confirmation" role="alertdialog" aria-labelledby="delete-title">
            <h2 id="delete-title" className="profile-row__title">Delete Account?</h2>
            <p className="profile-row__value">
              This removes your account and all associated data. This action cannot be undone.
            </p>
            <div className="profile-sheet-actions">
              <button type="button" className="profile-button" onClick={() => setConfirmingDelete(false)}>
                Cancel
              </button>
              <button type="button" className="profile-button profile-button--destructive" onClick={confirmDelete}>
                Delete Account
              </button>
            </div>
          </div>
        )}
      </div>

      <InteractiveSheet
        open={editing}
        title="Edit Name"
        onDismiss={closeEditor}
        onClosedFocus={editButtonRef}
      >
        <form
          className="profile-form"
          onSubmit={(event) => {
            event.preventDefault();
            saveName();
          }}
        >
          <label className="profile-form__label" htmlFor={inputId}>Display Name</label>
          <input
            ref={inputRef}
            id={inputId}
            className="profile-form__input"
            value={draftName}
            onChange={(event) => {
              setDraftName(event.target.value);
              if (error) setError('');
            }}
            aria-invalid={Boolean(error)}
            aria-describedby={`${inputId}-help${error ? ` ${inputId}-error` : ''}`}
          />
          <p id={`${inputId}-help`} className="profile-form__help">
            This appears on your profile and in shared projects.
          </p>
          {error && <p id={`${inputId}-error`} className="profile-form__error">{error}</p>}

          <div className="profile-sheet-actions">
            <button type="button" className="profile-button" onClick={closeEditor}>Cancel</button>
            <button type="submit" className="profile-button">Save</button>
          </div>
        </form>
      </InteractiveSheet>
    </main>
  );
}
