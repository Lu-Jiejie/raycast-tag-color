import {
  Action,
  ActionPanel,
  Alert,
  confirmAlert,
  Form,
  Icon,
  List,
  showToast,
  Toast,
  useNavigation,
} from '@raycast/api'
import { useCachedState } from '@raycast/utils'
import { useState } from 'react'
import { isValidColor } from './logic/colorValidation'

interface ColorItem {
  id: string
  value: string
}

function SetTextForm({ onSetTexts }: { onSetTexts: (texts: string[]) => void }) {
  const { pop } = useNavigation()

  function handleSubmit(values: { texts: string }) {
    const texts = values.texts.split('\n').filter(t => t.trim() !== '')
    if (texts.length === 0) {
      showToast({
        style: Toast.Style.Failure,
        title: 'No text entered',
      })
      return
    }
    onSetTexts(texts)
    pop()
  }

  return (
    <Form
      actions={(
        <ActionPanel>
          <Action.SubmitForm title="Set Texts" onSubmit={handleSubmit} />
        </ActionPanel>
      )}
    >
      <Form.TextArea
        id="texts"
        title="Display Texts"
        placeholder="Enter sample texts (one per line)"
        info="Each line will be displayed as a separate tag."
      />
    </Form>
  )
}

export default function Command() {
  const [searchText, setSearchText] = useState('')
  const [savedColors, setSavedColors] = useCachedState<ColorItem[]>('savedColors', [])
  const [displayTexts, setDisplayTexts] = useCachedState<string[]>('displayTexts', ['Sample Text', 'Another Tag'])
  const { push } = useNavigation()

  const handleSaveColor = (color: string) => {
    const trimmedColor = color.trim()

    if (!trimmedColor) {
      showToast({
        style: Toast.Style.Failure,
        title: 'Input Error',
        message: 'Color value cannot be empty.',
      })
      return
    }

    if (!isValidColor(trimmedColor)) {
      showToast({
        style: Toast.Style.Failure,
        title: 'Invalid Color',
        message: 'The entered value is not a valid color format.',
      })
      return
    }

    const existingColorIndex = savedColors.findIndex(c => c.value === trimmedColor)
    const newSavedColors = [...savedColors]

    if (existingColorIndex > -1) {
      const [existingColor] = newSavedColors.splice(existingColorIndex, 1)
      newSavedColors.unshift(existingColor)
    }
    else {
      const newColor: ColorItem = { id: Date.now().toString(), value: trimmedColor }
      newSavedColors.unshift(newColor)
    }

    setSavedColors(newSavedColors)
    setSearchText('')
    showToast({
      style: Toast.Style.Success,
      title: 'Color Saved',
      message: trimmedColor,
    })
  }

  const handleDeleteColor = async (id: string) => {
    if (
      await confirmAlert({
        title: 'Delete Color?',
        message: 'Are you sure you want to delete this color?',
        icon: Icon.Trash,
        primaryAction: {
          title: 'Delete',
          style: Alert.ActionStyle.Destructive,
        },
      })
    ) {
      setSavedColors(savedColors.filter(c => c.id !== id))
      showToast({
        style: Toast.Style.Success,
        title: 'Color Deleted',
      })
    }
  }

  const handleClearAllColors = async () => {
    if (
      await confirmAlert({
        title: 'Clear All Colors?',
        message: 'Are you sure you want to delete all saved colors? This action cannot be undone.',
        icon: Icon.Trash,
        primaryAction: {
          title: 'Clear All',
          style: Alert.ActionStyle.Destructive,
        },
      })
    ) {
      setSavedColors([])
      showToast({
        style: Toast.Style.Success,
        title: 'All Colors Cleared',
      })
    }
  }

  const handleSetDisplayTexts = (texts: string[]) => {
    setDisplayTexts(texts)
    showToast({
      style: Toast.Style.Success,
      title: 'Display Texts Updated',
    })
  }

  const isSearchTextValidColor = isValidColor(searchText)

  return (
    <List
      searchText={searchText}
      onSearchTextChange={setSearchText}
      navigationTitle="Manage Tag Colors"
      searchBarPlaceholder="Enter a color (e.g., #ff0000, red)"
    >
      {searchText.length > 0 && (
        <List.Item
          title={`Preview: "${searchText}" `}
          subtitle={isSearchTextValidColor ? 'Press Enter to Save' : 'Invalid Color'}
          accessories={displayTexts.map((text, index) => ({
            key: index.toString(),
            tag: { value: text, color: searchText },
          }))}
          actions={
            isSearchTextValidColor
              ? (
                  <ActionPanel>
                    <Action title="Save Color" icon={Icon.Plus} onAction={() => handleSaveColor(searchText)} />
                    <Action
                      title="Set Display Texts"
                      icon={Icon.Gear}
                      onAction={() => push(<SetTextForm onSetTexts={handleSetDisplayTexts} />)}
                    />
                  </ActionPanel>
                )
              : null
          }
        />
      )}
      <List.Section title="Saved Colors" subtitle={`${savedColors.length} colors`}>
        {savedColors.map(color => (
          <List.Item
            key={color.id}
            title={color.value}
            accessories={displayTexts.map((text, index) => ({
              key: index.toString(),
              tag: { value: text, color: color.value },
            }))}
            actions={(
              <ActionPanel>
                <ActionPanel.Section>
                  <Action title="Save Color" icon={Icon.Plus} onAction={() => handleSaveColor(searchText)} />
                  <Action.CopyToClipboard title="Copy Color" content={color.value} />
                </ActionPanel.Section>
                <ActionPanel.Section>
                  <Action
                    title="Set Display Texts"
                    icon={Icon.Gear}
                    onAction={() => push(<SetTextForm onSetTexts={handleSetDisplayTexts} />)}
                  />
                </ActionPanel.Section>
                <ActionPanel.Section>
                  <Action
                    title="Delete Color"
                    icon={Icon.Trash}
                    style={Action.Style.Destructive}
                    onAction={() => handleDeleteColor(color.id)}
                    shortcut={{ modifiers: ["ctrl"], key: "d" }}
                  />
                  <Action
                    title="Clear All Colors"
                    icon={Icon.Trash}
                    style={Action.Style.Destructive}
                    onAction={handleClearAllColors}
                    shortcut={{ modifiers: ["ctrl", "shift"], key: "delete" }}
                  />
                </ActionPanel.Section>
              </ActionPanel>
            )}
          />
        ))}
      </List.Section>
    </List>
  )
}
