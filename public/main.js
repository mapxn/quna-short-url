    const apiUrl = '/api/url/';
    const deleteUrl = '/api/url/';

    // 转换时间格式为北京时间
    function convertToBeijingTime(utcTimeString) {
      const utcDate = new Date(utcTimeString);
      const beijingOffset = 0 * 8 * 60; // 北京时间偏移量为8小时
      const beijingDate = new Date(utcDate.getTime() + beijingOffset * 60 * 1000);
      return beijingDate.toLocaleString('en-US', { timeZone: 'Asia/Shanghai' });
    }

    // 更新表格中的时间格式
    function updateTableTimeFormat() {
      const timeCells = document.querySelectorAll('td:nth-child(4), td:nth-child(5)');

      timeCells.forEach(cell => {
        const utcTimeString = cell.textContent;
        const beijingTimeString = convertToBeijingTime(utcTimeString);
        cell.textContent = beijingTimeString;
      });
    }

    // 使用fetch函数获取item数据
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        const itemTableBody = document.getElementById('itemTableBody');

        // 遍历item数组并创建表格行
        data.forEach(item => {
          const row = document.createElement('tr');

          // 创建复选框
          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.addEventListener('change', () => {
            updateDeleteSelectedButtonState();
          });

          const checkboxCell = document.createElement('td');
          checkboxCell.appendChild(checkbox);
          row.appendChild(checkboxCell);

          // 创建单元格并填充数据
          const keyCell = document.createElement('td');
          keyCell.textContent = item.key;
          row.appendChild(keyCell);

          const valueCell = document.createElement('td');
          valueCell.textContent = item.value;
          row.appendChild(valueCell);

          const createdAtCell = document.createElement('td');
          createdAtCell.textContent = item.createdAt;
          row.appendChild(createdAtCell);

          const updatedAtCell = document.createElement('td');
          updatedAtCell.textContent = item.updatedAt;
          row.appendChild(updatedAtCell);

          // 创建删除按钮
          const deleteButton = document.createElement('button');
          deleteButton.textContent = '删除';
          deleteButton.addEventListener('click', () => {
            const confirmDelete = confirm('确定要删除这个item吗？');
            if (confirmDelete) {
              deleteItem(item.key);
            }
          });

          const deleteCell = document.createElement('td');
          deleteCell.appendChild(deleteButton);
          row.appendChild(deleteCell);

          // 将行添加到表格主体
          itemTableBody.appendChild(row);
        });

        // 更新表格中的时间格式
        updateTableTimeFormat();
      })
      .catch(error => {
        console.error('Error:', error);
      });

    // 删除item
    function deleteItem(key) {
      const deleteData = {
        keys: [key]
      };

      fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(deleteData)
      })
        .then(response => {
          if (response.ok) {
            alert('删除成功！');
            location.reload(); // 刷新页面以更新表格
          } else {
            throw new Error('删除失败！');
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }

    // 更新批量删除按钮的状态
    function updateDeleteSelectedButtonState() {
      const checkboxes = document.querySelectorAll('input[type="checkbox"]');
      const deleteSelectedButton = document.getElementById('deleteSelectedButton');

      let isAnyCheckboxChecked = false;
      checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
          isAnyCheckboxChecked = true;
        }
      });

      deleteSelectedButton.disabled = !isAnyCheckboxChecked;
    }

    // 批量删除选中的item
    function deleteSelectedItems() {
      const checkboxes = document.querySelectorAll('input[type="checkbox"]');
      const selectedItems = [];

      checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
          const key = checkbox.parentElement.nextElementSibling.textContent;
          selectedItems.push(key);
        }
      });

      const confirmDelete = confirm(`确定要删除这${selectedItems.length}个item吗？`);
      if (confirmDelete) {
        const deleteData = {
          keys: selectedItems
        };

        fetch(deleteUrl, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(deleteData)
        })
          .then(response => {
            if (response.ok) {
              alert('批量删除成功！');
              location.reload(); // 刷新页面以更新表格
            } else {
              throw new Error('批量删除失败！');
            }
          })
          .catch(error => {
            console.error('Error:', error);
          });
      }
    }

    const deleteSelectedButton = document.getElementById('deleteSelectedButton');
    deleteSelectedButton.addEventListener('click', deleteSelectedItems);

    document.addEventListener('DOMContentLoaded', function() {
      const form = document.getElementById('myForm');

      form.addEventListener('submit', function(event) {
        event.preventDefault(); // 阻止表单提交的默认行为

        // 获取输入框的值
        const input1Value = document.getElementById('input1').value;
        const input2Value = document.getElementById('input2').value;

        // 构建请求的URL
        const url = '/api/' + input2Value;

        // 构建请求的数据
        const data = {
          value: input1Value
        };

        // 发送POST请求
        fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })
          .then(response => {
            if (response.ok) {
              // 请求成功的处理逻辑
              const shortLink = window.location.href + input2Value;
              alert('已经生成短链接：' + shortLink);
              location.reload(); // 刷新页面以更新表格
            } else {
              // 请求失败的处理逻辑
              throw new Error('请求失败: ' + response.status);
            }
          })
          .catch(error => {
            console.error('Error:', error);
          });
      });
    });