const config = {
  "action1-response": [
    {
      type: 'account.users',
      operation: 'append',
      value: 'data.val7.val2',
      conditions: [{ operator: '===', operand1: 'data.ack', operand2: true }, { operator: '!==', operand1: 'data.val7.val2', operand2: undefined }]
    }
  ],
  "action2-response": [
    {
      type: 'account.users',
      operation: 'removeByValue',
      value: 'data.val1',
      conditions: [{ operator: '===', operand1: 'data.ack', operand2: true }]
    }
  ]
}
export default config