import { ref, Ref } from 'vue'
import { cloneDeep } from 'lodash-es'
import type { FormInstance } from 'element-plus'
type cb = (...args: unknown[]) => unknown
export function userForm<O extends cb, S extends cb, C extends cb, F>({
  dialogVisible,
  formRef,
  beforeOpen,
  opened,
  beforeClose,
  closed,
  onSubmit
}: {
  dialogVisible: Ref<boolean>
  defaultForm?: F
  formRef?: Ref<FormInstance | undefined>
  beforeOpen?: O
  opened?: O
  beforeClose?: C
  closed?: C
  onSubmit?: S
}) {
  const open: O = ((...args) => {
    beforeOpen && beforeOpen(...args)
    dialogVisible.value = true
    return opened && opened(...args)
  }) as O

  const close: C = ((...args) => {
    beforeClose && beforeClose(...args)
    dialogVisible.value = false
    return closed && closed(...args)
  }) as C

  const submit: S = (async (...args) => {
    if (formRef) {
      await formRef.value!.validate((valid, _fields) => {
        if (!valid) {
          return
        }
      })
    }
    onSubmit && onSubmit(...args)
  }) as S

  return { open, submit, close }
}
// 使用
// const {
//   open,
//   close: handleClose,
//   submit
// } = userForm({
//   dialogVisible,
//   formRef,
//   beforeOpen(form, row) {
//     formData.value = cloneDeep(defaultFormData)
//     ...
//   },
//   onSubmit() {
//     const form = cloneDeep(formData.value)
//     ...
//   }
// })
