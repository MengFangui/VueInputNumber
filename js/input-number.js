//验证输入值是否为数字
function isValueNumber(value) {
	return(/(^-?[0-9]+\.{1}\d+$)|(^-?[1-9]*$)|(^-?0{1}$)/).test(value + '');
}
Vue.component('input-number', {
	//模板
	template: `
	<div class="input-number">
       	<input type="text" :value="currentValue" @change="handleChange" />
        <button @click="handleDown" :disabled="currentValue <= min">-</button>
        <button @click="handleUp" :disabled="currentValue >= max">+</button>
    </div>
	`,
	//props实现与父组件的通信（父组件-->子组件）
	//对每个props进行校验，props的值可以是数组，也可以是对象
	props: {
		max: {
			//必须是数字类型
			type: Number,
			//默认值为Infinity
			default: Infinity
		},
		min: {
			type: Number,
			default: -Infinity
		},
		value: {
			type: Number,
			default: 0
		}
	},
	//Vue组件为单向数据流，声明data来引用父组件的value，在组件内部维护currentValue
	data: function() {
		return {
			currentValue: this.value
		}
	},
	//监听：与父组件通信  （子组件-->父组件）
	watch: {
		currentValue: function(val) {
			//使用v-model改变value 
			//this指向当前组件实例
			this.$emit('input', val)
		}
		//		,
		//本示例未使用自定义函数，使用了v-mode input函数来更新value
		//		value: function(val) {
		//			//自定义事件on-change，告知父组件数字输入框值有所改变
		//			this.$emit('on-change', val)
		//		}
	},
	methods: {
		//父组件传递过来的值可能不符合条件（大于最大值，小于最小值）
		updateValue: function(val) {
			if(val > this.max) {
				val = this.max;
			}
			if(val < this.min) {
				val = this.min;
			}
			this.currentValue = val;
		},
		handleDown: function() {
			if(this.currentValue <= this.min) {
				return;
			}
			this.currentValue -= 1;
		},
		handleUp: function() {
			if(this.currentValue >= this.max) {
				return;
			}
			this.currentValue += 1;
		},
		handleChange: function(event) {
			var val = event.target.value.trim();
			var max = this.max;
			var min = this.min;
			if(isValueNumber(val)) {
				val = Number(val);
				this.currentValue = val;
				if(val > max) {
					this.current = max;
				}
				if(val < min) {
					this.current = min;
				}
			} else {
				//如果输入的不是数字，将输入的内容重置为之前的currentValue
				event.target.value = this.currentValue;
			}

		}
	},
	//初始化
	mounted: function() {
		this.updateValue(this.value);
	}
})