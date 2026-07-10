'use client'

import { useState } from 'react'
import { useTags } from '@/hooks/useTags'
import { TAG_COLORS, DEFAULT_TAG_COLOR } from '@/constants/theme'
import styles from './tags.module.css'

export default function TagsPage() {
  const { tags, addTag, editTag, removeTag } = useTags()
  const [showNewForm, setShowNewForm] = useState(false)
  const [newName, setNewName] = useState('')
  const [newColor, setNewColor] = useState(DEFAULT_TAG_COLOR)
  const [newError, setNewError] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editColor, setEditColor] = useState('')
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  async function handleCreate() {
    setNewError('')
    if (!newName.trim()) { setNewError('Tag name is required.'); return }
    try {
      await addTag(newName.trim(), newColor)
      setNewName('')
      setNewColor(DEFAULT_TAG_COLOR)
      setShowNewForm(false)
    } catch {
      setNewError('A tag with this name already exists.')
    }
  }

  function startEdit(id: string, name: string, color: string) {
    setEditingId(id)
    setEditName(name)
    setEditColor(color)
    setDeleteConfirmId(null)
  }

  async function handleEditSave(id: string) {
    if (!editName.trim()) return
    await editTag(id, { name: editName.trim(), color: editColor })
    setEditingId(null)
  }

  async function handleDelete(id: string) {
    await removeTag(id)
    setDeleteConfirmId(null)
  }

  return (
    <div className="page-container">
      <div className={styles.header}>
        <div>
          <h1 className={styles.pageTitle}>Tags</h1>
          <p className={styles.subtitle}>
            {tags.length} tag{tags.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button className={styles.addBtn} onClick={() => { setShowNewForm(true); setNewError('') }}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" width="16" height="16">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Tag
        </button>
      </div>

      {/* New tag form */}
      {showNewForm && (
        <div className={styles.formCard}>
          <p className={styles.formTitle}>New Tag</p>
          <div className={styles.formRow}>
            <input
              type="text"
              className={`${styles.nameInput} ${newError ? styles.inputError : ''}`}
              placeholder="Tag name"
              value={newName}
              onChange={(e) => { setNewName(e.target.value); setNewError('') }}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              autoFocus
            />
            <ColorPicker value={newColor} onChange={setNewColor} />
          </div>
          {newError && <p className={styles.errorMsg}>{newError}</p>}
          <div className={styles.formActions}>
            <button className={styles.btnSecondary} onClick={() => { setShowNewForm(false); setNewError('') }}>Cancel</button>
            <button className={styles.btnPrimary} onClick={handleCreate}>Create</button>
          </div>
        </div>
      )}

      {/* Empty state */}
      {tags.length === 0 && !showNewForm && (
        <div className={styles.emptyState}>
          <p className={styles.emptyIcon}>🏷️</p>
          <h2>No tags yet</h2>
          <p>Create tags to organize your saved links by topic or category.</p>
          <button className={styles.addBtn} onClick={() => setShowNewForm(true)}>
            Create your first tag
          </button>
        </div>
      )}

      {/* Tag list */}
      {tags.length > 0 && (
        <ul className={styles.list}>
          {tags.map((tag) => (
            <li key={tag.id} className={styles.listItem}>
              {editingId === tag.id ? (
                // Edit mode
                <div className={styles.editRow}>
                  <input
                    type="text"
                    className={styles.nameInput}
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleEditSave(tag.id); if (e.key === 'Escape') setEditingId(null) }}
                    autoFocus
                  />
                  <ColorPicker value={editColor} onChange={setEditColor} />
                  <div className={styles.editActions}>
                    <button className={styles.btnSecondary} onClick={() => setEditingId(null)}>Cancel</button>
                    <button className={styles.btnPrimary} onClick={() => handleEditSave(tag.id)}>Save</button>
                  </div>
                </div>
              ) : (
                // View mode
                <div className={styles.tagRow}>
                  <div className={styles.tagInfo}>
                    <span className={styles.tagDot} style={{ backgroundColor: tag.color }} />
                    <span className={styles.tagName}>{tag.name}</span>
                    <span className={styles.tagCount}>
                      {tag.link_count ?? 0} link{(tag.link_count ?? 0) !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className={styles.tagActions}>
                    <button
                      className={styles.iconBtn}
                      onClick={() => startEdit(tag.id, tag.name, tag.color)}
                      title="Edit tag"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" width="15" height="15">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
                      </svg>
                    </button>
                    {deleteConfirmId === tag.id ? (
                      <div className={styles.deleteConfirm}>
                        <span>Delete?</span>
                        <button className={styles.confirmYes} onClick={() => handleDelete(tag.id)}>Yes</button>
                        <button className={styles.confirmNo} onClick={() => setDeleteConfirmId(null)}>No</button>
                      </div>
                    ) : (
                      <button
                        className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
                        onClick={() => setDeleteConfirmId(tag.id)}
                        title="Delete tag"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" width="15" height="15">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// -------------------------------------------------------
// Color picker sub-component
// -------------------------------------------------------
function ColorPicker({ value, onChange }: { value: string; onChange: (c: string) => void }) {
  return (
    <div className={styles.colorPicker}>
      {TAG_COLORS.map((color) => (
        <button
          key={color}
          type="button"
          className={`${styles.colorSwatch} ${value === color ? styles.colorSwatchActive : ''}`}
          style={{ backgroundColor: color }}
          onClick={() => onChange(color)}
          title={color}
          aria-label={`Pick color ${color}`}
        />
      ))}
    </div>
  )
}
