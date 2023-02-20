document.getElementById('send-data-actbtn').addEventListener('click', async() => {
    callMain();
  })

  async () => {
    const result = await ipcRenderer.invoke('my-invokable-ipc', arg1, arg2)
    // ...
    console.log(result);
  }

function callMain(){
  console.log('hey call main')
}

const counter = document.getElementById('counter')

window.electronAPI.onUpdateCounter((_event, value) => {
  const oldValue = Number(counter.innerText)
  const newValue = oldValue + value
  counter.innerText = newValue
})