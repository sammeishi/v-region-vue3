import { reactive, inject, computed, h } from 'vue'
import { useDropdown } from '../utils/selector'

export default {
  name: 'RegionSelect',
  props: {
    list: { type: Array, required: true },
    blankText: String,
    modelValue: Object
  },
  emits: ['update:modelValue'],
  setup (props, { emit }) {
    const { visible, closeDropdown, generateDropdown } = useDropdown()

    const disabled = inject('disabled')
    const blank = inject('blank')

    const content = computed(() => {
      return (props.value && props.value.value)
        ? props.value.value
        : blank ? props.blankText : '&nbsp;'
    })
    const triggerClasses = reactive({
      'rg-select__el': true,
      'rg-select__el--active': visible,
      'rg-select__el--disabled': disabled
    })

    function select (val) {
      emit('update:modelValue', val)
      closeDropdown()
    }

    return () => {
      // dropdown trigger object
      const trigger = h(
        'div',
        { class: triggerClasses },
        [
          h('div', { class: 'rg-select__content' }, content.value),
          h('span', { class: 'rg-select__caret' })
        ]
      )

      const contents = []

      const items = props.list.map(val => {
        const selected = props.modelValue && props.modelValue.key === val.key
        const liOption = {
          key: val.key,
          class: { selected },
          onClick: () => { select(val) }
        }
        return h('li', liOption, val.value)
      })

      if (blank) { // "Please select" option
        items.unshift(h('li', { onClick: select }, props.blankText))
      }

      contents.push(h('ul', { class: 'rg-select__list' }, items))

      const dropdownProps = {
        class: 'rg-select',
        disabled: disabled.value
      }
      return generateDropdown(dropdownProps, trigger, contents)
    }
  }
}
